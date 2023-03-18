import React from "react";
import { getProductByAsin } from "../api/backendRequests";
import { useState, useEffect, useRef } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries, Crosshair, Hint, AreaSeries, LineSeries } from 'react-vis';
import "react-vis/dist/style.css";
import { Product, ProductPrice } from "../api/backendModels";
import { Badge, Highlight, Stack } from "@chakra-ui/react";
import { useToken } from '@chakra-ui/react'


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

    const [orange, gray] = useToken(
        // the key within the theme, in this case `theme.colors`
        'colors',
        // the subkey(s), resolving to `theme.colors.red.100`
        ['orange.400', 'gray.400'],
        // a single fallback or fallback array matching the length of the previous arg
    )


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
                // strokeDasharray="5, 5"
                strokeStyle={"dashed"}
                size={3}
                yDomain={[minValue?.y, maxValue?.y ?? 100]}
                xType={"time"}
                curve={'curveMonotoneX'}
                data={listPriceData}
                color={gray}
                onNearestX={_onNearestX}
            />

            <AreaSeries color={orange} opacity={.75} data={discountData} curve={"curveMonotoneX"} ></AreaSeries>

            {defaultOrActiveDataPoint &&

                <Crosshair values={[defaultOrActiveDataPoint]}>
                    <Stack direction='column'>
                        <Badge size="sm">{dateAddedLocaleString}</Badge>
                        <Badge variant="subtle" color={gray}>${defaultOrActiveDataPoint.obj.discounted_price} Total</Badge>
                        <Badge variant='subtle' color={orange}>${defaultOrActiveDataPoint.obj.discount} OFF</Badge>
                    </Stack>
                </Crosshair>
            }

        </XYPlot>
    </>

}