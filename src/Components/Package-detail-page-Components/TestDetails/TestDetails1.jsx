import React from "react";
import CBCHemogramTest from "./CBC Hemogram Test/CBCHemogramTest";

export default function TestDetails1({ packageData, loading, error, collection }) {

  return (
   <>
   <CBCHemogramTest packageData={packageData} loading={loading} error={error} collection={collection} />
   </>
  );
}