import React from "react";
import { getProductByAsin } from "../api/backendRequests";
import { useState, useEffect, useRef } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries, Crosshair, Hint, AreaSeries, LineSeries } from 'react-vis';
import "react-vis/dist/style.css";
import { Product, ProductPrice } from "../api/backendModels";
import { Badge, Highlight, Stack } from "@chakra-ui/react";

interface priceHistoryProps {
    asin?: string,
    product?: Product
}

interface GraphDataPoint {
    x: Date,
    y: number,
    obj: ProductPrice
}

export function ProductPriceHistoryGraph(props: priceHistoryProps) {
    const [product, setProduct] = useState<Product>(null);
    const [activeDataPoint, setActiveDataPoint] = useState<GraphDataPoint>();

    useEffect(() => {
        if (props.product) {
            setProduct(props.product)
        } else {
            getProductByAsin(props.asin)
                .then((product: Product) => {
                    setProduct(product)
                })
        }

        const listPriceData: GraphDataPoint[] = product?.prices.map(
            (elm, index) => ({ x: new Date(elm.date_modified), y: parseFloat(elm.discounted_price), obj: elm }));

        setActiveDataPoint(listPriceData?.at(1))
    }, [])

    const listPriceData: GraphDataPoint[] = product?.prices.map(
        (elm, index) => ({ x: new Date(elm.date_modified), y: parseFloat(elm.discounted_price), obj: elm }));


    const discountData: GraphDataPoint[] = product?.prices.map(
        (elm, index) => ({ x: new Date(elm.date_modified), y: parseFloat(elm.discount), obj: elm }));

    const maxValue = listPriceData?.reduce(function (prev, current) {
        return (prev.y > current.y) ? prev : current
    });

    const minValue = listPriceData?.reduce(function (prev, current) {
        return (prev.y < current.y) ? prev : current
    });

    const _onNearestX = (value, index) => {
        setActiveDataPoint(value);
    }

    const onExit = (event) => {
        setActiveDataPoint(null);
    }

    const defaultOrActiveDataPoint = activeDataPoint ?? listPriceData?.at(1);
    const dateAddedLocaleString = new Date(defaultOrActiveDataPoint?.obj?.date_added).toLocaleDateString() ?? "N/A"

    return <>
        <XYPlot
            margin={{
                bottom: 10,
                top: 10,
                left: 10,
                right: 10
            }}
            xType="time"
            width={300}
            height={150}
            onMouseLeave={() => this.setActiveDataPoint(false)}>

            {/* <YAxis tickTotal={2} tickFormat={(d) => `$${d}`} hideLine tickSizeInner={0} tickSizeOuter={0} /> */}

            <LineMarkSeries
                strokeDasharray="15"
                size={4}
                yDomain={[minValue?.y, maxValue?.y ?? 100]}
                xType={"time"}
                curve={'curveMonotoneX'}
                data={listPriceData}
                onNearestX={_onNearestX}
            />

            <AreaSeries color={"cyan"} data={discountData} curve={"curveMonotoneX"} opacity={0.15}></AreaSeries>

            {defaultOrActiveDataPoint &&

                <Crosshair values={[defaultOrActiveDataPoint]}>
                    <Stack direction='column'>
                        <Badge size="sm" variant='subtle'>{dateAddedLocaleString}</Badge>
                        <Badge variant="solid" colorScheme='blue'>${defaultOrActiveDataPoint.obj.discounted_price} Total</Badge>
                        <Badge variant='subtle' colorScheme='cyan'>${defaultOrActiveDataPoint.obj.discount} OFF</Badge>
                    </Stack>
                </Crosshair>
            }

        </XYPlot>
    </>

}