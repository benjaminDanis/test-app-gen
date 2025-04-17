import '@testing-library/jest-dom';

jest.mock('next/router', () => ({ router: jest.fn() }));
