import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';

interface AllTheProvidersProps {
  children: ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

export function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { wrapper: Wrapper = AllTheProviders, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <Wrapper>
        <AllTheProviders>{children}</AllTheProviders>
      </Wrapper>
    ),
    ...renderOptions,
  });
}

// Re-export everything from Testing Library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
