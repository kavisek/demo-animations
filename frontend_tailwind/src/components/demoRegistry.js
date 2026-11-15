// Maps each animation slug to its demo component. This file is a server module,
// so it imports client demos by name rather than through an object.
import { demos as basicDemos } from "@/components/Demos";
import Spreadsheet from "@/components/Spreadsheet";
import {
  DataBarsDemo,
  ExpandDemo,
  FilterDemo,
  LiveDemo,
  LoadingDemo,
  RowsDemo,
  SortDemo,
} from "@/components/TableDemos";

export const demos = {
  ...basicDemos,
  "table-rows": RowsDemo,
  "table-sort": SortDemo,
  "live-cells": LiveDemo,
  spreadsheet: Spreadsheet,
  "table-expand": ExpandDemo,
  "table-loading": LoadingDemo,
  "data-bars": DataBarsDemo,
  "table-filter": FilterDemo,
};
