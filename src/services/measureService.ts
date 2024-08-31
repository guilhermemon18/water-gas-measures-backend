import { Measure } from "../models/MeasureModel";
import db from "../database/db";

let measures: Measure[] = [
  {
    customer_code: "joao",
    has_confirmed: false,
    measure_datetime: new Date(),
    measure_type: "GAS",
    measure_uuid: "5486",
  },
  {
    customer_code: "joao",
    has_confirmed: false,
    measure_datetime: new Date(),
    measure_type: "WATER",
    measure_uuid: "5487",
  },
  {
    customer_code: "joao",
    has_confirmed: false,
    measure_datetime: new Date(),
    measure_type: "WATER",
    measure_uuid: "5488",
  },
  {
    customer_code: "joao",
    has_confirmed: false,
    measure_datetime: new Date(),
    measure_type: "GAS",
    measure_uuid: "5489",
  },
];

export const createMeasure = (measure: Measure): Measure => {
  const insertMeasure = db.prepare(`INSERT INTO measures (
    measure_uuid, customer_code, measure_datetime, measure_type, 
    measure_value, image_url, has_confirmed
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  insertMeasure.run(
    measure.measure_uuid,
    measure.customer_code,
    measure.measure_datetime.toISOString(),
    measure.measure_type,
    measure.measure_value,
    measure.image_url,
    measure.has_confirmed ? 1 : 0 ?? 0
  );
  return measure;
};

export const getAllCustomerMeasures = (
  customer_code: string,
  measure_type?: string
): Measure[] => {
  let sql = `SELECT * FROM measures WHERE customer_code = ?`;
  const params: (string | number)[] = [customer_code];

  if (measure_type) {
    sql += `AND measure_type = ?`;
    params.push(measure_type);
  }

  const getMeasureByCustomer = db.prepare(sql);
  const measures: Measure[] = getMeasureByCustomer.all(params) as Measure[];

  return measures.map((measure: Measure) => ({
    measure_uuid: measure.measure_uuid,
    customer_code: measure.customer_code,
    measure_datetime: new Date(measure.measure_datetime),
    measure_type: measure.measure_type as "WATER" | "GAS",
    measure_value: measure.measure_value,
    image_url: measure.image_url,
    has_confirmed: Boolean(measure.has_confirmed),
  }));
};

export const getMeasureById = (measure_uuid: string): Measure | undefined => {
  const getMeasureByUuid = db.prepare(`
    SELECT * FROM measures
    WHERE measure_uuid = ?
  `);
  const result = getMeasureByUuid.get(measure_uuid) as Measure;
  if (!result) {
    return undefined;
  }

  const measure: Measure = {
    measure_uuid: result.measure_uuid,
    customer_code: result.customer_code,
    measure_datetime: new Date(result.measure_datetime),
    measure_type: result.measure_type as "WATER" | "GAS",
    measure_value: result.measure_value,
    image_url: result.image_url,
    has_confirmed: Boolean(result.has_confirmed),
  };

  return measure;
};

export const getMeasureByCustomerAndMonth = (
  customer_code: string,
  month: string,
  year: string
): Measure | undefined => {
  const getMeasureByCustomerAndMonth = db.prepare(`SELECT * FROM measures
    WHERE customer_code = ?
    AND strftime('%Y', measure_datetime) = ?
    AND strftime('%m', measure_datetime) = ?`);

  const result: Measure = getMeasureByCustomerAndMonth.get(
    customer_code,
    year,
    month
  ) as Measure;

  if(!result){
    return undefined;
  }

  const measure: Measure = {
    measure_uuid: result.measure_uuid,
    customer_code: result.customer_code,
    measure_datetime: new Date(result.measure_datetime),
    measure_type: result.measure_type as "WATER" | "GAS",
    measure_value: result.measure_value,
    image_url: result.image_url,
    has_confirmed: Boolean(result.has_confirmed),
  };

  return measure;

};

export const editMeasure = (measure: Measure): void => {
  const updateMeasure = db.prepare(`
    UPDATE measures
    SET
      customer_code = ?,
      measure_datetime = ?,
      measure_type = ?,
      measure_value = ?,
      image_url = ?,
      has_confirmed = ?
    WHERE measure_uuid = ?
  `);

  updateMeasure.run(
    measure.customer_code,
    measure.measure_datetime.toISOString(),
    measure.measure_type,
    measure.measure_value,
    measure.image_url,
    measure.has_confirmed ? 1 : 0,
    measure.measure_uuid
  );
};
