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
  const [
    updateRegion,
    { isLoading: isLoadingRegion, isUpdating: isUpdatingRegion },
  ] = useUpdateRegionMutation();
  const handleSelectVotingArea = (areaId) => {
    // dispatch(requestUpdateRegion({ ...regionData, votings: [areaId] }));
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
        {isUpdatingRegion && <p>Änderungen werden gespeichert..</p>}
        {isLoadingRegion && <p>Region wird geladen..</p>}
      </FormGroup>
    </>
  );
};
