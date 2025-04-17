jest.mock('next/image');
jest.mock('next/link');
import { FlexCard } from '@newscorp-ghfb/dj-uds-flex-card';
import { render, screen } from '@testing-library/react';
import { NewsKitProvider, createTheme } from 'newskit';
import NextImage from 'next/image';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

const TestWrapper = ({ children }) => (
  <NewsKitProvider theme={createTheme({})}>
    {children}
  </NewsKitProvider>
);

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
describe('Flex Card', () => {
  it('renders on initial load', () => {
    render(<FlexCard />, {
        wrapper: TestWrapper,
    });
  });

  it('renders an image using next/image', () => {
    const mockProps = {
      hasImage: true,
      imageSrc: 'https://',
      ImageComponent: NextImage,
    };

    render(<FlexCard {...mockProps} />, {
      wrapper: TestWrapper,
    });
    
    screen.getByTestId('next-image-mock');
  });

  it('renders a link using next/link', () => {
    const mockProps = {
      title: 'Test',
      url: 'https://',
      LinkComponent: NextLink,
    };

    render(<FlexCard {...mockProps} />, {
      wrapper: TestWrapper,
    });
    
    screen.getByTestId('next-link-mock');
  });
});
