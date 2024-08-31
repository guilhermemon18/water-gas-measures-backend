import { Measure } from "./../models/MeasureModel";
import { Request, Response } from "express";
import * as measureService from "../services/measureService";
import { v4 as uuidv4 } from "uuid";
import { isValidBase64, isValidDateFormat, IsValidMeasureType } from "../utils/validators/measureRequestsValidators";
import { getMeasureByGemini } from "../services/geminiService";

export const createMeasure = async (request: Request, response: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = request.body;

  if (!image || !customer_code || !measure_datetime || !measure_type) {
    response.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Campos obrigatórios não enviados",
    });
    return;
  }else{
    if(!IsValidMeasureType(measure_type)){
      response.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "measure_type deve estar formatada como uma string 'WATER' ou 'GAS' ",
      });
      return;
    }

    // if(!isValidBase64(image)){
    //   response.status(400).json({
    //     error_code: "INVALID_DATA",
    //     error_description: "image deve estar formatada como uma imagem representada em string base64",
    //   });
    //   return;
    // }

    if(!isValidDateFormat(measure_datetime)){
      response.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "measure_datetime deve estar formatada como uma string YYYY-MM-DD ",
      });
      return;
    }
    
  }

  const measureDate: Date = new Date(measure_datetime);
  const currentMonthMeasure = measureService.getMeasureByCustomerAndMonth(
    customer_code,
    (measureDate.getMonth() + 1).toString().padStart(2, "0"),
    measureDate.getFullYear().toString()
  );

  if (currentMonthMeasure) {
    response.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    });
    return;
  }

  const measureGemini = await getMeasureByGemini(image);

  let measureAux: Measure = {
    customer_code: customer_code,
    measure_datetime: new Date(measure_datetime),
    measure_type: measure_type,
    has_confirmed: false,
    measure_uuid: uuidv4(),
    image_url: measureGemini.image_url,
    measure_value: measureGemini.measure_value
  };
  const measure = measureService.createMeasure(measureAux);
  response.status(200).json(
    {
      "image_url" : measureGemini.image_url,
      "measure_value": measureGemini.measure_value,
      "measure_uuid": measureAux.measure_uuid
    }
  );
};

export const getAllCustomerMeasures = (
  request: Request,
  response: Response
) => {
  const customer_code: string = request.params.id;
  const measure_type: string = request.query.measure_type as string;

  if (measure_type) {
    if (
      !(
        measure_type.toUpperCase() == "WATER" ||
        measure_type.toUpperCase() == "GAS"
      )
    ) {
      response.status(400).json({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      });
      return;
    }
  }

  const measures = measureService.getAllCustomerMeasures(
    customer_code,
    measure_type
  );
  if (measures.length < 1) {
    response.status(404).json({
      error_code: "MEASURES_NOT_FOUND",
      error_description: "Nenhuma leitura encontrada",
    });
    return;
  }
  response.json({
    customer_code: customer_code,
    measures: measures,
  });
};

export const confirmMeasure = (request: Request, response: Response) => {
  const { measure_uuid, confirmed_value } = request.body;

  if (!measure_uuid || !confirmed_value) {
    response.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "measure_uuid e confirmed_value devem ser fornecidos",
    });
    return;
  } else {
    if (
      !(typeof measure_uuid === "string" && Number.isInteger(confirmed_value))
    ) {
      response.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "measure_uuid deve ser string e confirmed_value deve ser inteiro",
      });
      return;
    }
  }

  let measure: Measure | undefined =
    measureService.getMeasureById(measure_uuid);
  if (!measure) {
    response.status(404).send({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura do mês já realizada",
    });
    return;
  }

  if (measure.has_confirmed) {
    response.status(409).json({
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura do mês já realizada",
    });
    return;
  }

  //atualiza os valores e confirma:
  measure.has_confirmed = true;
  measure.measure_value = confirmed_value;

  measureService.editMeasure(measure);

  response.status(200).json({
    sucess: true,
  });
};
