import React, { Children, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChevronRight from '@strapi/icons/ChevronRight';
import ChevronLeft from '@strapi/icons/ChevronLeft';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { Typography } from '../Typography';
import { KeyboardKeys } from '../helpers/keyboardKeys';

const CarouselGrid = styled(Box)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'startAction slides endAction';
`;

const CarouselSlides = styled(Box)`
  grid-area: slides;
`;

const CarouselAction = styled.button`
  grid-area: ${({ area }) => area};

  &:focus svg path,
  &:hover svg path {
    fill: ${({ theme }) => theme.colors.neutral900};
  }
`;

export const Carousel = ({
  label,
  children,
  previousLabel,
  nextLabel,
  selectedSlide,
  onPrevious,
  onNext,
  actions,
  hint,
  error,
  ...props
}) => {
  const prevActionRef = useRef(null);
  const nextActionRef = useRef(null);

  const childrenArray = Children.toArray(children).map((node, index) =>
    cloneElement(node, { selected: index === selectedSlide }),
  );

  const handleKeyDown = (e) => {
    switch (e.key) {
      case KeyboardKeys.RIGHT: {
        e.preventDefault();
        nextActionRef.current.focus();
        onNext();
        break;
      }

      case KeyboardKeys.LEFT: {
        e.preventDefault();
        prevActionRef.current.focus();
        onPrevious();
        break;
      }

      default:
        break;
    }
  };

  const hasChildren = childrenArray.length > 1;

  return (
    <Box {...props} onKeyDown={handleKeyDown}>
      <Box paddingBottom={1}>
        <Typography variant="pi" textColor="neutral800" fontWeight="bold">
          {label}
        </Typography>
      </Box>
      <Box padding={2} borderColor="neutral200" hasRadius background="neutral100">
        <CarouselGrid as="section" aria-roledescription="carousel" aria-label={label} position="relative">
          {hasChildren && (
            <CarouselAction
              onClick={onPrevious}
              area="startAction"
              ref={prevActionRef}
              aria-label={previousLabel}
              type="button"
            >
              <Icon as={ChevronLeft} aria-hidden={true} width="6px" height="10px" color="neutral600" />
            </CarouselAction>
          )}

          {hasChildren && (
            <CarouselAction onClick={onNext} area="endAction" ref={nextActionRef} aria-label={nextLabel} type="button">
              <Icon as={ChevronRight} aria-hidden={true} width="6px" height="10px" color="neutral600" />
            </CarouselAction>
          )}

          <CarouselSlides aria-live="polite" paddingLeft={2} paddingRight={2} width="100%">
            {childrenArray}
          </CarouselSlides>
          {actions}
        </CarouselGrid>
      </Box>
      {hint || error ? (
        <Box paddingTop={1}>
          <Typography variant="pi" textColor={error ? 'danger600' : 'neutral600'}>
            {hint || error}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

Carousel.defaultProps = {
  actions: undefined,
  error: undefined,
  hint: undefined,
};

Carousel.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  previousLabel: PropTypes.string.isRequired,
  selectedSlide: PropTypes.number.isRequired,
};
