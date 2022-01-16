import { Heading } from "../../shared/Heading";
import { Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
// @ts-ignore
import { isArrayWithOneElement } from "../../../utils/utils";
import React, { useEffect, useState } from "react";
import { CSVReader } from "react-papaparse";
// @ts-ignore
import { LefSelect } from "../../shared/LefSelect";
import { LefGenericChart } from "./LefGenericChart";
import { DataMapPreview } from "./genericWidgetEditorComponents/DataMapPreview";
// @ts-ignore
import { LefButton } from "../../shared/LefButton";
// @ts-ignore
import { LefModal } from "../../shared/LefModal";
// @ts-ignore
import { useUpdateGenericChartMutation } from "../../../redux/lefReduxApi";
// @ts-ignore
import { CsvHeaderMapping } from "./genericWidgetEditorComponents/CsvHeaderMapping";
import { IGenericWidget } from "../../../types/IGenericWidget";
import { ChartType } from "chart.js";
import { IDataMapEntry } from "../../../types/IDataMapEntry";

type FIX_LATER = any;

const CHART_TYPES = [
  { id: "bar", label: "Balkendiagramm" },
  { id: "scatter", label: "Punktdiagramm" },
  { id: "cake", label: "Kuchendiagramm" },
  { id: "line", label: "Liniendiagramm" },
];

function convertCsvToDataMap(
  csvData: ICsvData,
  contentRowIndex: number,
  valueRowIndex: number,
  timestampRowIndex: number,
  descriptionRowIndex: number
): IDataMapEntry[] {
  let convertedData: any[] = [];
  csvData.forEach((entry) => {
    const content = entry[contentRowIndex];
    const value = entry[valueRowIndex];
    const timestamp = entry[timestampRowIndex];
    const description = entry[descriptionRowIndex];
    const oldEntry = convertedData.find((c) => c.timestamp === timestamp);

    if (oldEntry) {
      convertedData[convertedData.indexOf(oldEntry)] = {
        ...oldEntry,
        values: [...oldEntry.values, { content, value }],
      };
    } else {
      convertedData.push({
        timestamp,
        description,
        values: [{ content, value }],
      });
    }
  });
  return convertedData;
}

interface TSelectValues {
  value: ChartType;
}

interface ICsvData {
  [index: number]: any[];
  length: number;
  forEach(param: (entry: any) => void): void;
}

interface ICsvHeaders {
  [index: number]: string;
}

export const GenericWidgetEditor = ({
  currentObject,
  open,
  onClose = () => {},
}: {
  currentObject: IGenericWidget;
  open: boolean;
  onClose: () => void;
}) => {
  const [dataMap, setDataMap] = useState(currentObject.dataMap || []);
  const [title, setTitle] = useState(currentObject.title || "");
  const [description, setDescription] = useState(
    currentObject.description || ""
  );
  const [chartType, setChartType] = useState(currentObject.chartType || "line");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [contentRowIndex, setContentRowIndex] = useState(-1);
  const [valueRowIndex, setValueRowIndex] = useState(-1);
  const [timestampRowIndex, setTimestampRowIndex] = useState(-1);
  const [descriptionRowIndex, setDescriptionRowIndex] = useState(-1);
  const [csvData, setCsvData] = useState<ICsvData>([]);
  const [csvHeaders, setCsvHeaders] = useState<ICsvHeaders>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDataImportModal, setShowDataImportModal] = useState(false);

  const categories = dataMap
    .map((entry) => entry.values)
    .map((v) => (v.length > 0 ? v[0].value : 0));
  const maximumCategories = Math.max(...categories);

  const [
    updateGenericChart,
    { isSuccess: isSuccessGenericChart, isLoading: updatingGenericChart },
  ] = useUpdateGenericChartMutation();

  useEffect(() => {
    if (isSuccessGenericChart) {
      onClose();
    }
  }, [isSuccessGenericChart]);

  const csvReader = (
    <CSVReader
      onFileLoad={(data) => {
        if (data.length === 0) return;
        const map = data.map((d) => d.data).slice(hasHeaders ? 1 : 0);
        console.debug({ map });
        setCsvData(map);
        if (hasHeaders) {
          const firstEntry = data[0].data;
          setCsvHeaders(firstEntry);
        }
      }}
      //onError={this.handleOnError}
      //onRemoveFile={this.handleOnRemoveFile}
    >
      <span>Datei auswählen oder hier ablegen</span>
    </CSVReader>
  );

  let find = CHART_TYPES.find((t) => t.id === chartType);
  const steps = [
    {
      id: "common",
      title: "Allgemeine Einstellungen",
      content: (
        <>
          {" "}
          <Form.Group controlId={"title"} as={Row}>
            <Form.Label>Bezeichnung</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type={"text"}
              placeholder={"Titel eingeben"}
              value={title as string}
            />
            <p className={"small"}>
              {
                'Geben Sie einen Titel in Form einer Frage ein, z.B. "Wie haben sich die CO2-Emissionen in den letzten Jahren verändert?"'
              }
            </p>
          </Form.Group>
          <Form.Group as={Row} controlId={"description"}>
            <Form.Label>Beschreibungstext</Form.Label>
            <Form.Control
              onChange={(e) => setDescription(e.target.value)}
              type={"text"}
              placeholder={"Beschreibung eingeben"}
              value={description as string}
            />
          </Form.Group>
        </>
      ),
      nextEnabled: title !== "" && description !== "",
      nextLabel: "Weiter",
    },
    {
      id: "importCsv",
      title: "Daten",
      content: (
        <>
          <Col xs={12}>
            <Row>
              <Heading size={"h5"} text={"Importierte Daten"} />
            </Row>
            <Row>{`Die Daten beinhalten ${dataMap.length} Zeitpunkte mit jeweils bis zu ${maximumCategories} Kategorien.`}</Row>
            <Row className={"mb-3 alert alert-dark mt-2"}>
              {dataMap.length > 0 && <DataMapPreview dataMap={dataMap} />}
            </Row>

            <Row>
              <LefButton
                onClick={() => setShowDataImportModal(true)}
                title={
                  dataMap.length > 0 ? "Daten ersetzen" : "Daten importieren"
                }
              />{" "}
            </Row>
          </Col>

          <LefModal
            title={"Daten importieren"}
            show={showDataImportModal}
            buttons={[
              {
                label: "Abbrechen",
                onClick: () => setShowDataImportModal(false),
                variant: "secondary",
              },
              {
                label: "Importieren",
                onClick: () => {
                  setDataMap(
                    convertCsvToDataMap(
                      csvData,
                      contentRowIndex,
                      valueRowIndex,
                      timestampRowIndex,
                      descriptionRowIndex
                    )
                  );
                  setShowDataImportModal(false);
                },
              },
            ]}
            content={
              <Col xs={12}>
                <Row className={"mt-3"}>
                  <Heading text={"Daten importieren"} size={"h5"} />
                </Row>
                <Row>
                  <Heading text={"1. CSV-Datei importieren"} size={"h6"} />
                </Row>
                {csvReader}
                {csvData.length > 0 && (
                  <>
                    <Row className={"mt-3"}>
                      <Heading text={"2. Spalten zuweisen"} size={"h6"} />
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <CsvHeaderMapping
                          headers={csvHeaders}
                          updateMapping={(a: string, b: number) => {
                            switch (a) {
                              case "content":
                                setContentRowIndex(b);
                                break;
                              case "value":
                                setValueRowIndex(b);
                                break;
                              case "timestamp":
                                setTimestampRowIndex(b);
                                break;
                              case "description":
                                setDescriptionRowIndex(b);
                                break;
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            }
          />
        </>
      ),
      nextEnabled: dataMap.length > 0,
      nextLabel: "Weiter",
    },
    {
      id: "preview",
      title: "Darstellung",
      content: (
        <>
          <FormGroup className={"w-100"} as={Row}>
            <FormLabel>{`Darstellung`}</FormLabel>
            <div className={"w-100"}>
              <LefSelect
                clearButton
                {...(find && {
                  defaultSelected: [
                    {
                      value: chartType,
                      label: find.label,
                    },
                  ],
                })}
                id={"chartTypeSelect"}
                options={CHART_TYPES.map((type) => ({
                  label: type.label,
                  value: type.id,
                }))}
                onChange={(values: TSelectValues[]) =>
                  isArrayWithOneElement(values) && setChartType(values[0].value)
                }
              />
            </div>
          </FormGroup>
          <Row>
            <Col xs={12}>
              <Row className={"mt-3"}>
                <Heading size={"h6"} text={"Diagramm (Vorschau)"} />
              </Row>
              <Row className={"p-3 justify-content-center"}>
                <LefGenericChart
                  genericChart={{
                    chartType,
                    dataMap,
                    title,
                    description,
                    objectType: "none",
                  }}
                />
              </Row>
            </Col>
          </Row>
        </>
      ),
      nextEnabled: true,
      nextLabel: "Speichern",
      onNext: () =>
        updateGenericChart({
          ...currentObject,
          dataMap,
          description,
          title,
          chartType,
        }),
    },
  ];

  const currentStepObject = steps[currentStep];
  const content = <Col>{currentStepObject.content}</Col>;
  return (
    <LefModal
      size={"xl"}
      show={open}
      title={currentStepObject.title}
      content={content}
      buttons={[
        {
          label: "Abbrechen",
          onClick: () => onClose(),
          variant: "secondary",
        },
        ...(currentStep > 0
          ? [
              {
                label: "Zurück",
                onClick: () => setCurrentStep(currentStep - 1),
                variant: "secondary",
              },
            ]
          : []),
        {
          disabled: !currentStepObject.nextEnabled,
          label: currentStepObject.nextLabel,
          loading: updatingGenericChart,
          onClick: currentStepObject.onNext
            ? currentStepObject.onNext
            : () => setCurrentStep(currentStep + 1),
        },
      ]}
    />
  );
};
