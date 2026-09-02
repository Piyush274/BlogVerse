import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateArticlePage from "@/pages/CreateArticlePage";
import EditArticlePage from "@/pages/EditArticlePage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PaymentFailurePage from "@/pages/PaymentFailurePage";
import AboutPage from "@/pages/AboutPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failure" element={<PaymentFailurePage />} />

      {/* Protected Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/articles/create"
        element={
          <ProtectedRoute>
            <CreateArticlePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/articles/:id/edit"
        element={
          <ProtectedRoute>
            <EditArticlePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
