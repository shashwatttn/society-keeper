import AuthenticationProvider from "./_components/AuthenticationProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {

  

  return (
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
  );
};

export default Layout;
