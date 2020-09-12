import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Apps16 } from '@carbon/icons-react';

import { Button } from '../../index';
import { settings } from '../../constants/Settings';
import { CARD_TYPES } from '../../constants/LayoutConstants';

import CardGalleryList from './CardGalleryList/CardGalleryList';
import CardEditForm from './CardEditForm/CardEditForm';

const { iotPrefix } = settings;

const defaultProps = {
  value: null,
  // errors: null,
  i18n: {
    galleryHeader: 'Gallery',
    openGalleryButton: 'Open gallery',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
  },
};

const propTypes = {
  /** card data being edited */
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** validation errors on the value object */
  // errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  /** Callback function when card is added from list */
  onAddCard: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    openGalleryButton: PropTypes.string,
  }),
};

const CardEditor = ({ value, onChange, onAddCard, i18n }) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };

  const baseClassName = `${iotPrefix}--card-editor`;

  const [showGallery, setShowGallery] = useState(!value);

  return (
    <div className={baseClassName}>
      {!showGallery ? (
        <div className={`${baseClassName}--header`}>
          <Button
            className="gallery-button"
            kind="ghost"
            size="small"
            renderIcon={Apps16}
            onClick={() => setShowGallery(true)}
          >
            {mergedI18N.openGalleryButton}
          </Button>
        </div>
      ) : null}
      <div className={`${baseClassName}--content`}>
        {showGallery ? (
          <CardGalleryList
            onAddCard={onAddCard}
            supportedTypes={Object.keys(CARD_TYPES)}
            i18n={{
              galleryHeader: mergedI18N.galleryHeader,
            }}
          />
        ) : (
          <CardEditForm value={value} onChange={onChange} />
        )}
      </div>
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
