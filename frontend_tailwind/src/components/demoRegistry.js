// Maps each animation slug (unique across projects) to its demo component. This file is a server module,
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
import { AlertsDemo, AppLaunchDemo, DynamicIslandDemo, NotificationsDemo } from "@/components/ios/SystemDemos";
import { BottomSheetDemo, PushNavigationDemo } from "@/components/ios/NavigationDemos";
import { ChatDemo, ControlsDemo, PullToRefreshDemo, SwipeActionsDemo } from "@/components/ios/ListDemos";
import { ColumnsDemo, DonutDemo, KpiDemo, LineDemo, LiveDemo as LiveChartDemo, RaceDemo, ScatterDemo, StackedDemo } from "@/components/charts/ChartDemos";

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
  // iOS Animations
  "dynamic-island": DynamicIslandDemo,
  notifications: NotificationsDemo,
  "app-launch": AppLaunchDemo,
  alerts: AlertsDemo,
  "push-navigation": PushNavigationDemo,
  "bottom-sheet": BottomSheetDemo,
  "swipe-actions": SwipeActionsDemo,
  "pull-to-refresh": PullToRefreshDemo,
  controls: ControlsDemo,
  chat: ChatDemo,
  // Data Visualizations
  "chart-columns": ColumnsDemo,
  "chart-stacked": StackedDemo,
  "chart-race": RaceDemo,
  "chart-line": LineDemo,
  "chart-live": LiveChartDemo,
  "chart-donut": DonutDemo,
  "chart-scatter": ScatterDemo,
  "chart-kpi": KpiDemo,
};
