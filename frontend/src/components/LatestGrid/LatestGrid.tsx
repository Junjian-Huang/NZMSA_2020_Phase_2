import React, { useEffect, useState } from 'react';
import { getArray, ModifyProps, modifyArray} from '../../api/Api';
import CircularProgress from '../CircularProgress/CircularProgress';
import Grid  from "../Grid/Grid";
import Information from "../Text/Information";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";


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

      return isLoading ? <CircularProgress /> :
      <div>
        <Container fluid>
          <Row style={{justifyContent: "center"}}>
              <Col md={6}>
                  <Grid colourArray={colourArray} canEdit={true} modifyArray={modifyColour} />
                  <div style={{ textAlign: "center", margin: "5% 0" }}>
                      <Link style={{ textAlign: "center"}} to="/history">
                        View Canvas Hisotry
                      </Link>
                  </div>
              </Col>
              <Col md={6} style={{ textAlign: "center", minWidth: "600px" }} >
                  <Information/>
              </Col>
          </Row>
        </Container>  
      </div>
}

export default LatestGrid;