import React, { useState, useEffect } from "react";
import { getArray, ModifyProps, modifyArray} from "../../api/Api";
import CircularProgress from "../CircularProgress/CircularProgress";
import { Grid } from "@material-ui/core";

const LatestGrid = () =>{
    const [colourArray, setColourArray] = useState<string[][]>([]);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const makeArrayRequest = async () => {
          setColourArray(await getArray());
        }
        makeArrayRequest();
        setInterval(makeArrayRequest, 10000)
      }, []) 

      const modifyColour = async (props: ModifyProps) => {
        await modifyArray(props);
        setColourArray(await getArray());
      };

      return isLoading ? <CircularProgress /> : <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
}

export default LatestGrid;