import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/HeaderComponents/Header";
import SideBarContainer from "./containers/SideBar-container/SideBarContainer";
import ApplicationModuleContainer from "./containers/Application-module-container/ApplicationModuleContainer";

import LoginContainer from "./components/login-components/LoginContainer";
import Scopes from "./components/login-components/Scope";

const Student = () => <div>Student</div>;
const Dashboard = () => <div>Dasboard</div>;
const Students = () => <div>Students</div>;
const Employee = () => <div>Employee</div>;
const Fleet = () => <div>Fleet</div>;
const Warehouse = () => <div>Worehouse</div>;
const Sms = () => <div>SMS</div>;
const QuestionBank = () => <div>Question Bank</div>;
const AssetsManagement = () => <div>Assets Management</div>;
const PaymentsService = () => <div>Payment Services</div>;
const Cctv = () => <div>CCTV</div>;
const Hrms = () => <div>HRMS</div>;
const Masters = () => <div>Masters</div>;

// Create the QueryClient instance
const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <div className="whole_container">
      <Header />

      <aside>
        <SideBarContainer />
      </aside>

      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="/application/*" element={<ApplicationModuleContainer />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/sms" element={<Sms />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/assets-management" element={<AssetsManagement />} />
        <Route path="/payments-service" element={<PaymentsService />} />
        <Route path="/cctv" element={<Cctv />} />
        <Route path="/hrms" element={<Hrms />} />
        <Route path="/masters" element={<Masters />} />
      </Routes>
    </div>

    // <div className="whole_container">
    //   <Header />

    //   <aside>
    //     <SideBarContainer />
    //   </aside>

    //    <Routes>
    //             <Route path="/dashboard" element={<Dashboard />} />
    //             <Route path="/students" element={<Students />} />
    //             <Route path="/application/*" element={<ApplicationModuleContainer />} />
    //             <Route path="/employee" element={<Employee />} />
    //             <Route path="/fleet" element={<Fleet />} />
    //             <Route path="/warehouse" element={<Warehouse />} />
    //             <Route path="/sms" element={<Sms />} />
    //             <Route path="/question-bank" element={<QuestionBank />} />
    //             <Route path="/assets-management" element={<AssetsManagement />} />
    //             <Route path="/payments-service" element={<PaymentsService />} />
    //             <Route path="/cctv" element={<Cctv />} />
    //             <Route path="/hrms" element={<Hrms />} />
    //             <Route path="/masters" element={<Masters />} />
    //        </Routes>
    // </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        
        <div className="scopes_app">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login/*" element={<LoginContainer />} />
            <Route path="/scopes/*" element={<AppWrapper />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
