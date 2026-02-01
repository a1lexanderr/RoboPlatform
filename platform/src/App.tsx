import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Header from "./components/Header";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import News from "./pages/News";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import TeamListPage from "./pages/teams/TeamListPage";
import TeamCreatePage from "./pages/teams/TeamCreatePage";
import TeamDetailsPage from "./pages/teams/TeamDetailsPage";
import TeamEditPage from "./pages/teams/TeamEditPage";

import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionList from "./components/competitions/CompetitionList";
import { CompetitionDetails } from "./components/competitions/CompetitionDetails";
import { CompetitionForm } from "./components/competitions/CompetitionForm";

import NotFoundPage from "./pages/NotFoundPage";
import CartPage from "./pages/marketplace/CartPage";
import OrdersPage from "./pages/marketplace/OrdersPage";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import { CartProvider } from "./context/CartContext";
import ProductCreatePage from "./pages/marketplace/ProductCreatePage";

const RootRedirect: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Загрузка...
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.roles.includes("ADMIN")) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <CartProvider>
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />

      <main className="pt-[94px] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/competitions" element={<CompetitionList />} /> 
 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardPage />}>
              <Route path="/marketplace/create" element={<ProductCreatePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/dashboard" element={<TeamListPage />} />
              <Route path="/teams" element={<TeamListPage />} />
              <Route path="/teams/create" element={<TeamCreatePage />} />
              <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
              <Route path="/teams/:teamId/edit" element={<TeamEditPage />} />

              <Route path="/account/competitions" element={<CompetitionsPage />} />
              <Route path="/account/competitions/new" element={<CompetitionForm />} />
              <Route path="/account/competitions/:id" element={<CompetitionDetails />} />
              <Route path="/account/competitions/:id/edit" element={<CompetitionForm />} />
            </Route>
          </Route>

          <Route path="/redirect" element={<RootRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
    </CartProvider>
  );
};

export default App;
