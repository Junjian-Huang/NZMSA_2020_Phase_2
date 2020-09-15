import { Typography, Button } from "@material-ui/core";
import React,{ useState, useEffect } from "react";

import Grid from "../Grid/Grid";
import CircularProgress from "../CircularProgress/CircularProgress";

// utils
import { ITransformedHistoricalData, IHistoricalDataDates, transformHistoricalData, historicalDataDates, extractColors} from "../../utils/gridHistory";
import { Link } from "react-router-dom";
import { getHistoricalData, getCanvasById } from "../../api/Api";
  



const HistoricalGrid = () => {
    //dateIdx, canvas Id, { canvasId: date[] }, 2D array of colors, { canvaId: { date: updatedCell[] } }
    const [currDateIdx, setCurrDateIdx] = useState<number>(-1);
    const [selectedCanvasId, setSelectedCanvasId] = useState<number>(-1);

    const [colors, setColors] = useState<string[][]>();
    const [historicalData, setHistoricalData] = useState<ITransformedHistoricalData>();
    const [canvasModifiedDates, setCanvasModifiedDates] = useState<IHistoricalDataDates>();

    const onLoadComponent = async () => {
        // fectch and transform and historical data
        const hist = await getHistoricalData();
        const transformed = await transformHistoricalData(hist);
        setHistoricalData(transformed);

        // set the modified dates of each canvas
        const modifiedDates = historicalDataDates(transformed);
        setCanvasModifiedDates(modifiedDates);

        const firstCanvasIdKey = Number(Object.keys(transformed)[0]);
        setSelectedCanvasId(firstCanvasIdKey);
    };

    useEffect(() => {
        onLoadComponent()
    },[]);

    useEffect(() => {
        (async () => {
            if (selectedCanvasId !== -1 && canvasModifiedDates) {
                const canvas = await getCanvasById(selectedCanvasId);
                const colorsArray = extractColors(canvas);
    
                const latestModifiedDates = canvasModifiedDates[canvas.canvasID]
    
                setCurrDateIdx(latestModifiedDates.length - 1);
                setColors(colorsArray);
            }
        })();
    }, [selectedCanvasId, canvasModifiedDates]);

    const onSelectCanvasId = (newCanvasId: number) => setSelectedCanvasId(newCanvasId);

    const handlePrev = () => {
        const modifiedDates = canvasModifiedDates![selectedCanvasId]
        const currDate = modifiedDates[currDateIdx]

        const updatedCells = historicalData![selectedCanvasId][currDate]

        setColors(prevState => {
           for (const { row, col, oldHex} of updatedCells) prevState![row][col] = oldHex 

           return prevState
        })

        setCurrDateIdx(currDateIdx - 1)
    }

    const handleNext = () => {
        const modifiedDates = canvasModifiedDates![selectedCanvasId]
        const nextDateIdx = currDateIdx +1
        const nextDate = modifiedDates[nextDateIdx]

        const updatedCells = historicalData![selectedCanvasId][nextDate]

        setColors(prevState =>{
            for (const { row, col, newHex } of updatedCells) prevState![row][col] = newHex

            return prevState
        })

        setCurrDateIdx(nextDateIdx)
    }

    const noPrev = () => currDateIdx === 0;

    const noNext = () => currDateIdx === canvasModifiedDates![selectedCanvasId].length - 1;

    const PrevButton = () => (
        <Button variant="contained" disabled = {noPrev()} onClick={() => handlePrev()}>
            Last date
        </Button>
    );

    const HomeButton = () => (
        <Button variant="contained">
            <Link to="/">Home</Link>
        </Button>
    );

    const NextButton = () => (
        <Button variant="contained" disabled={noNext()} onClick ={() => handleNext()}>
            Next date        
        </Button>
    );

    if (colors && historicalData && canvasModifiedDates){
        return (
        <main style={{textAlign: "center"}}>
            <header>
                <Typography variant="h6">List of Canvas IDs:</Typography>
                {Object.keys(historicalData).map((canvasId, idx) => (
                    <Button key={idx} onClick={() => onSelectCanvasId(Number(canvasId))}>
                        {canvasId}
                    </Button>
                ))}  
            </header>
            <Grid canEdit={false} colourArray={colors} />

            <footer>
                <Typography style={{ margin: "10px"}} variant="h6">{canvasModifiedDates[selectedCanvasId][currDateIdx]}</Typography>
                <div style={{display: "flex", justifyContent: "space-evenly" }}>
                    <PrevButton/>
                    <HomeButton/>
                    <NextButton/>
                </div>
            </footer>            
        </main>
        );
    } else return <CircularProgress/>;
    
};



export default HistoricalGrid;