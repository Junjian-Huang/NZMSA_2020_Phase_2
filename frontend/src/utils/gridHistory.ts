import { getColorDataById, IColorData, IHistoricalData, ICanvasData} from "../api/Api"
import moment from 'moment'
import _ from "lodash"

export interface IUpdatedCell{
    oldHex:string
    newHex:string
    row:number
    col:number
}

export interface  IHistoricalDataDates{
    [canvasId: number]: string[]
}

export interface ITransformedHistoricalData{
    [canvasId: number]: { [date: string]: IUpdatedCell[] }
}


const DATE_FORMAT = "YYYY-MM-DD";


const getAllColorData = (historicalDataArray: IHistoricalData[]): Promise<IColorData[]> => 
    Promise.all(historicalDataArray.map((data) => getColorDataById(deserializeHistoricalData(data).colorDataId)));


const deserializeHistoricalData = (historicalData: IHistoricalData) => {
    const { oldValues, newValues, keyValues, dateTime } = historicalData;
  
    const oldHex = JSON.parse(oldValues).Hex;
    const newHex = JSON.parse(newValues).Hex;
    const colorDataId = JSON.parse(keyValues).ColorDataID;
  
    return { oldHex, newHex, colorDataId, dateTime };
};


  // all the dates value in the array are sorted from earliest to the latest already
export const transformHistoricalData = async (historicalDataArray: IHistoricalData[]): Promise<ITransformedHistoricalData> => {
    const result: ITransformedHistoricalData = {};
    const allColorData = await getAllColorData(historicalDataArray);


        // allColorData and historicalDataArray have the same length
    for (let idx = 0; idx < allColorData.length; idx++) {
        const { oldHex, newHex, dateTime } = deserializeHistoricalData(historicalDataArray[idx]);
        const { rowIndex, columnIndex, canvasID } = allColorData[idx];

        // transform from 2020-08-25T12:08:51.026Z to 2020-08-25
        const localDateValue = moment.utc(dateTime).local().format(DATE_FORMAT);

        // initializations
        if (!result[canvasID]) result[canvasID] = {};
        if (!result[canvasID][localDateValue]) result[canvasID][localDateValue] = [];

            // format cell data
        const updatedCell: IUpdatedCell = { oldHex, newHex, row: rowIndex, col: columnIndex };
        result[canvasID][localDateValue].push(updatedCell);
    }

    return result;
};


export const historicalDataDates = (histData: ITransformedHistoricalData): IHistoricalDataDates => {
    const result: IHistoricalDataDates = {};
  
    for (const key of Object.keys(histData)) {
      const canvasID = Number(key);
      const canvasIDModifiedDates = Object.keys(histData[canvasID]);
      result[canvasID] = canvasIDModifiedDates;
    }
  
    return result;
  };

  export const extractColors = (canvas: ICanvasData) => {
        // assume it is a square grid
      const gridSize = Math.sqrt(canvas.colorData.length);
      // init a gridSize by gridSize array filled with '' strings
      const colors: string[][] = [...Array(gridSize)].map(_ => Array(gridSize).fill(""));

         // first sort by row index, then by the column index
      const sortedColorData = _.orderBy(canvas.colorData, ["rowIndex", "columnIndex"]);

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
            colors[r][c] = sortedColorData[gridSize * r + c].hex;
            }
        }
        return colors
  }