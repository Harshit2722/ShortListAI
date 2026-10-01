import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext.jsx";
import DeviceRestriction from "./components/common/DeviceRestriction";

function App() {
  return (
    <AuthProvider>
      <DeviceRestriction />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;