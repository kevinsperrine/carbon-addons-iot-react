import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';
import warning from 'warning';

import { settings } from '../../constants/Settings';
import deprecate, { deprecateString } from '../../internal/deprecate';
import { useDropdownTitleFixer } from '../IconDropdown/dropdownHooks';
import useMerged from '../../hooks/useMerged';

const { iotPrefix } = settings;

const colorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});

const propTypes = {
  /** Array of colors to be shown */
  colors: PropTypes.arrayOf(colorPropType),
  /** True disables the control */
  disabled: PropTypes.bool,
  /** The label of the Dropdown, defaults to 'Select a color' */
  label: deprecateString(),
  /** True if the dropdown should hide the color names that display next to the color box */
  hideLabels: PropTypes.bool,
  /** The title of the Dropdown, defaults to 'Color' */
  titleText: deprecateString(),
  /** Required Id string */
  id: PropTypes.string.isRequired,
  /** True if the light theme is to be used, defaults to false */
  light: PropTypes.bool,
  /** Callback for when any of the Dropdown color value changes */
  onChange: PropTypes.func.isRequired,
  /** Callback to translate common strings */
  translateWithId: PropTypes.func,
  /** The selected color, use to set initial color */
  selectedColor: colorPropType,
  // TODO: remove deprecated testID in v3.
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id used if needed for testing */
  testId: PropTypes.string,
  i18n: PropTypes.shape({
    /** The label of the Dropdown, defaults to 'Select a color' */
    label: PropTypes.string,
    /** The title of the Dropdown, defaults to 'Color' */
    titleText: PropTypes.string,
  }),
};

const defaultProps = {
  colors: [
    { carbonColor: purple70, name: 'purple70' },
    { carbonColor: cyan50, name: 'cyan50' },
    { carbonColor: teal70, name: 'teal70' },
    { carbonColor: magenta70, name: 'magenta70' },
    { carbonColor: red50, name: 'red50' },
    { carbonColor: red90, name: 'red90' },
    { carbonColor: green60, name: 'green60' },
    { carbonColor: blue80, name: 'blue80' },
    { carbonColor: magenta50, name: 'magenta50' },
    { carbonColor: purple50, name: 'purple50' },
    { carbonColor: teal50, name: 'teal50' },
    { carbonColor: cyan90, name: 'cyan90' },
  ],
  label: undefined,
  titleText: undefined,
  disabled: false,
  hideLabels: false,
  light: false,
  selectedColor: undefined,
  testId: 'color-dropdown',
  translateWithId: undefined,
  i18n: {
    label: 'Select a color',
    titleText: 'Color',
  },
};

const ColorDropdown = ({
  colors,
  disabled,
  id,
  label,
  hideLabels,
  light,
  onChange,
  selectedColor: selectedColorProp,
  titleText,
  // TODO: remove deprecated testID in v3.
  testID,
  testId,
  translateWithId,
  i18n,
}) => {
  React.useEffect(() => {
    if (__DEV__) {
      warning(
        false,
        'The `ColorDropdown` is an experimental component and could be lacking unit test and documentation. Be aware that minor version bumps could introduce breaking changes. For the reasons listed above use of this component in production is highly discouraged'
      );
    }
  }, []);
  const mergedI18n = useMerged(defaultProps.i18n, i18n);

  const [selectedColor, setSelectedColor] = useState(selectedColorProp);
  const [dropdownRef, updateTitle] = useDropdownTitleFixer();

  useEffect(() => {
    if ((selectedColor?.name || selectedColor?.carbonColor) && dropdownRef?.current) {
      updateTitle(selectedColor.name || selectedColor.carbonColor);
    }
  }, [dropdownRef, selectedColor, selectedColorProp, updateTitle]);

  const renderColorItem = (item) => {
    return (
      <div title={`${item.name}`} className={`${iotPrefix}--color-dropdown__item`}>
        <div className={`${iotPrefix}--color-dropdown__item-border`}>
          <div
            title={`${item.carbonColor}`}
            className={`${iotPrefix}--color-dropdown__color-sample`}
            style={{ backgroundColor: item.carbonColor }}
          />
          {!hideLabels && (
            <div className={`${iotPrefix}--color-dropdown__color-name`}>{item.name}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dropdown
      ref={dropdownRef}
      className={`${iotPrefix}--color-dropdown`}
      id={id}
      itemToString={renderColorItem}
      items={colors}
      label={label || mergedI18n.label}
      light={light}
      title={label || mergedI18n.label}
      translateWithId={translateWithId}
      onChange={({ selectedItem }) => {
        setSelectedColor(selectedItem);
        onChange({ color: selectedItem });
      }}
      selectedItem={selectedColor}
      titleText={titleText || mergedI18n.titleText}
      type="default"
      data-testid={testID || testId}
      disabled={disabled}
    />
  );
};

ColorDropdown.propTypes = propTypes;
ColorDropdown.defaultProps = defaultProps;

export default ColorDropdown;
