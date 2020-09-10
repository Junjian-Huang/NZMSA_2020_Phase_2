import React, { useEffect, useState } from 'react';
import { getArray, ModifyProps, modifyArray} from '../../api/Api';
import CircularProgress from '../CircularProgress/CircularProgress';
import Grid  from "../Grid/Grid";

const LatestGrid = () => {
    const [ colourArray, setColourArray ] = useState<string[][]>([]);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() =>{
      if ( colourArray.length > 0 && isLoading ) setIsLoading(false);
    }, [isLoading, colourArray])

    useEffect(() => {
        const makeArrayRequest = async () => {
            setColourArray(await getArray());
        }
        makeArrayRequest();
        setInterval(makeArrayRequest, 10000);
      }, []);

      const modifyColour = async (props: ModifyProps) => {
        await modifyArray(props);
        setColourArray(await getArray());
      }

      return isLoading ? <CircularProgress /> : <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
}

export default LatestGrid;