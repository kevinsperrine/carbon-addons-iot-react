import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PageWizard, { childrenPropType } from './PageWizardIot';

const StatefulPageWizardPropTypes = {
  children: childrenPropType,
  /** Id of current step */
  currentStepId: PropTypes.string,
  /** action when click next button called with no param */
  onNext: PropTypes.func,
  /** action when click back button called with no param */
  onBack: PropTypes.func,
  /** action if the inline wizard is closed or canceled */
  onClose: PropTypes.func.isRequired,
  /** action triggered if the inline wizard has submitted final step */
  onSubmit: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    /** label to show on the cancel button */
    cancel: PropTypes.string,
    /** label to show on the back button */
    back: PropTypes.string,
    /** label to show on the next button */
    next: PropTypes.string,
    /** label to show on the submit button */
    submit: PropTypes.string,
    /** label to show on the close notification button */
    close: PropTypes.string,
  }),
  /** function to go to step when click ProgressIndicator step. */
  setStep: PropTypes.func.isRequired,
  /** next button disabled */
  nextDisabled: PropTypes.bool,
  /** show progress indicator on finish button */
  sendingData: PropTypes.bool,
  /** Form Error Details */
  error: PropTypes.string,
  /** required callback to clear the error */
  onClearError: PropTypes.func.isRequired,
  /** use sticky footer to show buttons at the bottom */
  hasStickyFooter: PropTypes.bool,
  /** Displays the progress indicator vertically */
  isProgressIndicatorVertical: PropTypes.bool,
  /** Content to render before footer buttons (on left side, in LTR) */
  beforeFooterContent: PropTypes.node,
};

const defaultProps = {
  children: [],
  nextDisabled: false,
  currentStepId: null,
  i18n: {
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
  },
  sendingData: false,
  error: null,
  hasStickyFooter: false,
  isProgressIndicatorVertical: true,
  onNext: null,
  onBack: null,
  beforeFooterContent: null,
};

const StatefulPageWizard = ({
  currentStepId: currentStepIdProp,
  children,
  onNext,
  onBack,
  setStep,
  ...other
}) => {
  const steps = React.Children.map(children, step => step.props);
  const [currentStepId, setCurrentStepId] = useState(currentStepIdProp || (steps && steps[0].id));
  const currentStepIndex = steps.findIndex(i => i.id === currentStepId);

  //skip disabled steps when clicking next or prev
  const getAvailableStep = previous => {
    let value = undefined;
    if (previous) {
      let idx = currentStepIndex - 1;
      while (true) {
        if (idx >= 0) {
          if (steps[idx].disabled === true) {
            if (idx !== 0) {
              idx--;
            }
          } else {
            value = steps[idx];
            break;
          }
        } else {
          break;
        }
      }
    } else {
      let idx = currentStepIndex + 1;
      while (true) {
        if (idx < steps.length) {
          if (steps[idx].disabled === true) {
            if (idx !== steps.length - 1) {
              idx++;
            }
          } else {
            value = steps[idx];
            break;
          }
        } else {
          break;
        }
      }
    }
    return value;
  };

  const nextStep = getAvailableStep();
  const prevStep = getAvailableStep(true);

  const handleNext = id => {
    setCurrentStepId(id);
    if (onNext) onNext(id);
  };

  const handleBack = id => {
    setCurrentStepId(id);
    if (onBack) onBack(id);
  };

  const validateSteps = (start, end) => {
    let valid = true;
    for (let i = start; i < end; i += 1) {
      valid = steps[i].onValidate() && valid;
      if (valid === undefined) {
        valid = true && valid;
      }
    }
    return valid;
  };

  return (
    <PageWizard
      {...other}
      onBack={() => handleBack(prevStep.id)}
      onNext={() => handleNext(nextStep.id)}
      currentStepId={currentStepId}
      setStep={id => {
        const idx = steps.findIndex(i => i.id === id);
        if (idx <= currentStepIndex || validateSteps(currentStepIndex, idx)) {
          setCurrentStepId(id);
          setStep(id);
        }
      }}
    >
      {children}
    </PageWizard>
  );
};

StatefulPageWizard.propTypes = StatefulPageWizardPropTypes;
StatefulPageWizard.defaultProps = defaultProps;
export default StatefulPageWizard;
