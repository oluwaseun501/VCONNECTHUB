import * as React from 'react';
import { cn } from '@/lib/utils';
import * as RechartsPrimitive from 'recharts';

// Format: { THEME_NAME: CSS_SELECTOR }
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const THEMES = { light: '', dark: '.dark' };















const ChartContext = /*#__PURE__*/React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = /*#__PURE__*/React.forwardRef(







  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

    return (/*#__PURE__*/
      _jsxDEV(ChartContext.Provider, { value: { config }, children: /*#__PURE__*/
        _jsxDEV("div", {
          "data-chart": chartId,
          ref: ref,
          className: cn(
            "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
            className
          ), ...
          props, children: [/*#__PURE__*/

          _jsxDEV(ChartStyle, { id: chartId, config: config }, void 0, false), /*#__PURE__*/
          _jsxDEV(RechartsPrimitive.ResponsiveContainer, { children:
            children }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ));

  });
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (/*#__PURE__*/
    _jsxDEV("style", {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).
        map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.
          map(([key, itemConfig]) => {
            const color =
            itemConfig.theme?.[theme] ||
            itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).
          join('\n')}
}
`
        ).
        join('\n')
      } }, void 0, false
    ));

};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = /*#__PURE__*/React.forwardRef(










  (
  {
    active,
    payload,
    className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey
  },
  ref) =>
  {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
      !labelKey && typeof label === 'string' ?
      config[label]?.label || label :
      itemConfig?.label;

      if (labelFormatter) {
        return (/*#__PURE__*/
          _jsxDEV("div", { className: cn('font-medium', labelClassName), children:
            labelFormatter(value, payload) }, void 0, false
          ));

      }

      if (!value) {
        return null;
      }

      return /*#__PURE__*/_jsxDEV("div", { className: cn('font-medium', labelClassName), children: value }, void 0, false);
    }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey]
    );

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (/*#__PURE__*/
      _jsxDEV("div", {
        ref: ref,
        className: cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        ), children: [

        !nestLabel ? tooltipLabel : null, /*#__PURE__*/
        _jsxDEV("div", { className: "grid gap-1.5", children:
          payload.
          filter((item) => item.type !== 'none').
          map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (/*#__PURE__*/
              _jsxDEV("div", {

                className: cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                ), children:

                formatter && item?.value !== undefined && item.name ?
                formatter(item.value, item.name, item, index, item.payload) : /*#__PURE__*/

                _jsxDEV(_Fragment, { children: [
                  itemConfig?.icon ? /*#__PURE__*/
                  _jsxDEV(itemConfig.icon, {}, void 0, false) :

                  !hideIndicator && /*#__PURE__*/
                  _jsxDEV("div", {
                    className: cn(
                      'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                      {
                        'h-2.5 w-2.5': indicator === 'dot',
                        'w-1': indicator === 'line',
                        'w-0 border-[1.5px] border-dashed bg-transparent':
                        indicator === 'dashed',
                        'my-0.5': nestLabel && indicator === 'dashed'
                      }
                    ),
                    style:
                    {
                      '--color-bg': indicatorColor,
                      '--color-border': indicatorColor
                    } }, void 0, false

                  ), /*#__PURE__*/


                  _jsxDEV("div", {
                    className: cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    ), children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "grid gap-1.5", children: [
                      nestLabel ? tooltipLabel : null, /*#__PURE__*/
                      _jsxDEV("span", { className: "text-muted-foreground", children:
                        itemConfig?.label || item.name }, void 0, false
                      )] }, void 0, true
                    ),
                    item.value && /*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono font-medium tabular-nums text-foreground", children:
                      item.value.toLocaleString() }, void 0, false
                    )] }, void 0, true

                  )] }, void 0, true
                ) }, item.dataKey, false

              ));

          }) }, void 0, false
        )] }, void 0, true
      ));

  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = /*#__PURE__*/React.forwardRef(







  (
  { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
  ref) =>
  {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (/*#__PURE__*/
      _jsxDEV("div", {
        ref: ref,
        className: cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        ), children:

        payload.
        filter((item) => item.type !== 'none').
        map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (/*#__PURE__*/
            _jsxDEV("div", {

              className: cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
              ), children: [

              itemConfig?.icon && !hideIcon ? /*#__PURE__*/
              _jsxDEV(itemConfig.icon, {}, void 0, false) : /*#__PURE__*/

              _jsxDEV("div", {
                className: "h-2 w-2 shrink-0 rounded-[2px]",
                style: {
                  backgroundColor: item.color
                } }, void 0, false
              ),

              itemConfig?.label] }, item.value, true
            ));

        }) }, void 0, false
      ));

  }
);
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
config,
payload,
key)
{
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
  'payload' in payload &&
  typeof payload.payload === 'object' &&
  payload.payload !== null ?
  payload.payload :
  undefined;

  let configLabelKey = key;

  if (
  key in payload &&
  typeof payload[key] === 'string')
  {
    configLabelKey = payload[key];
  } else if (
  payloadPayload &&
  key in payloadPayload &&
  typeof payloadPayload[key] === 'string')
  {
    configLabelKey = payloadPayload[
    key];

  }

  return configLabelKey in config ?
  config[configLabelKey] :
  config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle };