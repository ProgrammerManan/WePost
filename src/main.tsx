import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; /* It will control the routing of the application */
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvide";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter>

)
