import { LefSelect } from "../../shared/LefSelect";
import {
  useGetAllVotingAreasQuery,
  useUpdateRegionMutation,
} from "../../../redux/lefReduxApi";
import { isArrayWithOneElement } from "../../../utils/utils";
import { Badge, FormGroup, FormLabel } from "react-bootstrap";
import React from "react";

export const SelectVotingDistrictArea = ({ regionData = {} }) => {
  const { data: allVotingAreas = [] } = useGetAllVotingAreasQuery();
  const [
    updateRegion,
    { isLoading: isLoadingRegion, isSuccess },
  ] = useUpdateRegionMutation();
  const handleSelectVotingArea = (areaId) => {
    updateRegion({ ...regionData, votings: [areaId] });
  };
  return (
    <>
      <FormGroup>
        <FormLabel>{`Wahlbezirk`}</FormLabel>
        <LefSelect
          options={allVotingAreas.map((area) => ({
            label: area.districtName,
            value: area._id,
          }))}
          onChange={(values) =>
            isArrayWithOneElement(values) &&
            handleSelectVotingArea(values[0].value)
          }
        />
        {isLoadingRegion && (
          <Badge variant={"info"}>Änderungen werden gespeichert..</Badge>
        )}
        {isSuccess && (
          <Badge variant={"success"}>Änderungen gespeichert!</Badge>
        )}
      </FormGroup>
    </>
  );
};
