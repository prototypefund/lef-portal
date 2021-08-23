import { LefSelect } from "../../shared/LefSelect";
import {
  useGetAllVotingAreasQuery,
  useUpdateRegionMutation,
} from "../../../redux/lefReduxApi";
import { isArrayWithOneElement } from "../../../utils/utils";
import { FormGroup, FormLabel } from "react-bootstrap";
import React from "react";

export const SelectVotingDistrictArea = ({ regionData = {} }) => {
  const { data: allVotingAreas = [] } = useGetAllVotingAreasQuery();
  const [updateRegion] = useUpdateRegionMutation();
  const handleSelectVotingArea = (areaId) => {
    updateRegion({ ...regionData, votings: [areaId] });
  };
  return (
    <>
      <FormGroup className={"w-100"}>
        <FormLabel>{`Wahlbezirk`}</FormLabel>
        <LefSelect
          id={"votingAreaSelect"}
          options={allVotingAreas.map((area) => ({
            label: area.districtName,
            value: area._id,
          }))}
          onChange={(values) =>
            isArrayWithOneElement(values) &&
            handleSelectVotingArea(values[0].value)
          }
        />
        {/*{isLoadingRegion && (
          <Badge variant={"info"}>Änderungen werden gespeichert..</Badge>
        )}
        {isSuccess && (
          <Badge variant={"success"}>Änderungen gespeichert!</Badge>
        )}*/}
      </FormGroup>
    </>
  );
};
