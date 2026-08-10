use headless_chrome::{Browser, LaunchOptions};
use std::fs;
use std::path::Path;
use std::time::Duration;
use anyhow::Result;

struct RouteGroup {
    role_name: &'static str,
    email: &'static str,
    password: &'static str,
    routes: Vec<(&'static str, &'static str)>,
}

fn main() -> Result<()> {
    let base_url = "http://localhost:3000";
    let output_dir = "../figma-views-headless";

    if !Path::new(output_dir).exists() {
        fs::create_dir_all(output_dir)?;
    }

    let public_routes = vec![
        ("/", "index"),
        ("/login", "login"),
        ("/register", "register"),
        ("/register-company", "register-company"),
        ("/forgot-password", "forgot-password"),
        ("/reset-password", "reset-password"),
        ("/mfa", "mfa"),
        ("/setup-mfa", "setup-mfa"),
    ];

    let groups = vec![
        RouteGroup {
            role_name: "admin",
            email: "chinopaco.05@gmail.com",
            password: "Francisco_1",
            routes: vec![
                ("/admin/organizations", "admin-organizations"),
                ("/admin/catalog", "admin-catalog"),
                ("/admin/fraud", "admin-fraud"),
            ],
        },
        RouteGroup {
            role_name: "moderator",
            email: "franciscojavierg.h.051130@gmail.com",
            password: "Paco_12345",
            routes: vec![
                ("/mod/incidents", "mod-incidents"),
                ("/mod/appeals", "mod-appeals"),
                ("/mod/audit-logs", "mod-audit-logs"),
                ("/mod/skills", "mod-skills"),
                ("/mod/support", "mod-support"),
                ("/mod/verifications", "mod-verifications"),
            ],
        },
        RouteGroup {
            role_name: "candidate",
            email: "alguienn340@gmail.com",
            password: "Paco_12345",
            routes: vec![
                ("/dashboard", "candidate-dashboard"),
                ("/vacancies", "candidate-vacancies"),
                ("/companies", "candidate-companies"),
                ("/messages", "candidate-messages"),
                ("/settings", "candidate-settings"),
                ("/profile", "candidate-profile"),
                ("/support", "candidate-support"),
            ],
        },
        RouteGroup {
            role_name: "organization",
            email: "franchescojavini@gmail.com",
            password: "Francisco_12345",
            routes: vec![
                ("/applicants", "org-applicants"),
                ("/my-vacancies", "org-my-vacancies"),
                ("/messages", "org-messages"),
                ("/settings", "org-settings"),
                ("/support", "org-support"),
            ],
        },
    ];

    println!("Iniciando Chrome Headless...");

    // CSS rules to enforce black and white exactly as required
    let bw_style = r#"
        let style = document.createElement('style');
        style.innerHTML = `
            *, *::before, *::after {
                color: #000 !important;
                background-color: #fff !important;
                border-color: #000 !important;
                box-shadow: none !important;
                text-shadow: none !important;
                background-image: none !important;
            }
            svg, path, rect, circle, polygon, polyline, line {
                fill: #000 !important;
                stroke: #000 !important;
            }
            img, video, canvas {
                filter: grayscale(100%) contrast(1.2) !important;
            }
        `;
        document.head.appendChild(style);
    "#;

    // Lanzamos Chrome una vez, pero reabriremos el tab para limpiar sesión (o usaremos incognito si es posible, 
    // pero crear un tab nuevo suele compartir cookies. Para limpiar cookies usaremos JS).
    let browser = Browser::new(LaunchOptions {
        headless: true,
        ..Default::default()
    })?;

    let tab = browser.new_tab()?;

    // ==========================================
    // 1. RUTAS PÚBLICAS
    // ==========================================
    println!("=== PROCESANDO RUTAS PÚBLICAS ===");
    for (route, name) in public_routes {
        let url = format!("{}{}", base_url, route);
        println!("Visitando: {}", url);
        if let Ok(_) = tab.navigate_to(&url) {
            let _ = tab.wait_until_navigated();
            std::thread::sleep(Duration::from_secs(3));
            let _ = tab.evaluate(bw_style, false);
            std::thread::sleep(Duration::from_millis(500));
            if let Ok(res) = tab.evaluate("document.documentElement.outerHTML", false) {
                if let Some(html) = res.value.and_then(|v| v.as_str().map(|s| s.to_string())) {
                    let out_path = format!("{}/public_{}.html", output_dir, name);
                    let _ = fs::write(&out_path, html);
                    println!("Guardado: {}", out_path);
                }
            }
        }
    }

    // ==========================================
    // 2. RUTAS PROTEGIDAS (POR ROL)
    // ==========================================
    for group in groups {
        println!("=== INICIANDO SESIÓN COMO: {} ===", group.role_name.to_uppercase());
        
        // Limpiamos datos de sesión previos (localStorage, sessionStorage, cookies)
        let _ = tab.navigate_to(base_url);
        let _ = tab.wait_until_navigated();
        let _ = tab.evaluate("localStorage.clear(); sessionStorage.clear(); document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });", false);
        std::thread::sleep(Duration::from_secs(1));

        // Vamos al login
        let login_url = format!("{}/login", base_url);
        if let Ok(_) = tab.navigate_to(&login_url) {
            let _ = tab.wait_until_navigated();
            std::thread::sleep(Duration::from_secs(2));

            println!("Ingresando credenciales de {}...", group.role_name);
            
            // Intentar escribir el email
            if let Ok(email_elem) = tab.wait_for_element("#email") {
                let _ = email_elem.type_into(group.email);
            } else {
                println!("No se encontró el input #email");
                continue;
            }

            // Intentar escribir el password
            if let Ok(pass_elem) = tab.wait_for_element("#password") {
                let _ = pass_elem.type_into(group.password);
            } else {
                println!("No se encontró el input #password");
                continue;
            }

            // Click al botón de login
            if let Ok(btn_elem) = tab.wait_for_element("button[type=\"submit\"]") {
                let _ = btn_elem.click();
            } else {
                println!("No se encontró el botón de submit");
                continue;
            }

            // Esperar a que la autenticación termine y redirija
            println!("Esperando redirección...");
            std::thread::sleep(Duration::from_secs(6));

            // Ahora recorremos las rutas del rol
            for (route, name) in group.routes {
                let url = format!("{}{}", base_url, route);
                println!("Visitando ruta protegida: {}", url);
                
                if let Ok(_) = tab.navigate_to(&url) {
                    let _ = tab.wait_until_navigated();
                    std::thread::sleep(Duration::from_secs(4)); // Tiempo para requests
                    
                    let _ = tab.evaluate(bw_style, false);
                    std::thread::sleep(Duration::from_millis(500));
                    
                    if let Ok(res) = tab.evaluate("document.documentElement.outerHTML", false) {
                        if let Some(html) = res.value.and_then(|v| v.as_str().map(|s| s.to_string())) {
                            let out_path = format!("{}/{}_{}.html", output_dir, group.role_name, name);
                            let _ = fs::write(&out_path, html);
                            println!("Guardado: {}", out_path);
                        }
                    }
                }
            }
        }
    }

    println!("¡Proceso completado!");
    Ok(())
}
