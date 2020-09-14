const API_BASE_URL = process.env.NODE_ENV === "development" ? "https://localhost:3000/" : "https://junjianhuangmsaphase2.azurewebsites.net/";

const CANVAS_API_URL = "https://junjianhuangmsaphase2.azurewebsites.net/";

export const getArray = async () => {
    let response = await fetch(CANVAS_API_URL + "GetCanvas", {
      headers: {
        Accept: "application/json",
      },
    }).then((res) => res.json()).then(res => JSON.parse(res));
    return response;
  }

  export interface ModifyProps {
    position: { row: number; col: number },
    colour: string
  }

  export const modifyArray = async ({ position: { row, col }, colour }: ModifyProps) => {
    const body = JSON.stringify({ row: row, column: col, hex: colour});
    await fetch(CANVAS_API_URL + "UpdateCell", {
      body,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "PUT"
    });
  }