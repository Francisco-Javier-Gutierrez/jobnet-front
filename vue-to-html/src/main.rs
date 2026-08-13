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

    // Configuraci├│n para Figma y dise├▒o original
    let inject_figma_scripts = r###"
        let script1 = document.createElement('script');
        script1.src = 'https://cdn.tailwindcss.com?plugins=forms,container-queries';
        document.head.appendChild(script1);

        let script2 = document.createElement('script');
        script2.id = 'tailwind-config';
        script2.innerHTML = `
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "tertiary-container": "#4b4dd8",
                  "secondary-container": "#6cf8bb",
                  "primary-container": "#4f46e5",
                  "on-secondary-fixed": "#002113",
                  "on-primary-fixed": "#0f0069",
                  "on-surface-variant": "#464555",
                  "on-error-container": "#93000a",
                  error: "#ba1a1a",
                  "tertiary-fixed": "#e1e0ff",
                  "secondary-fixed-dim": "#4edea3",
                  "on-primary-container": "#dad7ff",
                  "tertiary-fixed-dim": "#c0c1ff",
                  "surface-tint": "#4d44e3",
                  secondary: "#006c49",
                  primary: "#3525cd",
                  tertiary: "#3130c0",
                  background: "#f9f9ff",
                  "inverse-surface": "#263143",
                  "outline-variant": "#c7c4d8",
                  "on-error": "#ffffff",
                  "on-secondary-fixed-variant": "#005236",
                  "secondary-fixed": "#6ffbbe",
                  "on-background": "#111c2d",
                  surface: "#f9f9ff",
                  "surface-container": "#e7eeff",
                  "on-surface": "#111c2d",
                  "inverse-primary": "#c3c0ff",
                  "error-container": "#ffdad6",
                  "surface-container-lowest": "#ffffff",
                  "on-secondary-container": "#00714d",
                  "surface-bright": "#f9f9ff",
                  "surface-container-highest": "#d8e3fb",
                  "inverse-on-surface": "#ecf1ff",
                  "on-secondary": "#ffffff",
                  "on-tertiary": "#ffffff",
                  "on-tertiary-fixed": "#07006c",
                  "on-tertiary-container": "#d9d8ff",
                  outline: "#777587",
                  "surface-container-low": "#f0f3ff",
                  "on-tertiary-fixed-variant": "#2f2ebe",
                  "surface-variant": "#d8e3fb",
                  "surface-dim": "#cfdaf2",
                  "surface-container-high": "#dee8ff",
                  "primary-fixed-dim": "#c3c0ff",
                  "on-primary": "#ffffff",
                  "primary-fixed": "#e2dfff",
                  "on-primary-fixed-variant": "#3323cc"
                }
              }
            }
          };
        `;
        document.head.appendChild(script2);
        
        let styleTag = document.createElement('style');
        styleTag.innerHTML = `
          :root {
            --color-background: #f9f9ff;
            --color-on-background: #111c2d;
            --color-surface: #f9f9ff;
            --color-on-surface: #111c2d;
            --color-on-surface-variant: #464555;
            --color-surface-container: #e7eeff;
            --color-surface-container-low: #f0f3ff;
            --color-surface-container-high: #dee8ff;
            --color-surface-container-highest: #d8e3fb;
            --color-surface-container-lowest: #ffffff;
            --color-surface-variant: #d8e3fb;
            --color-surface-bright: #f9f9ff;
            --color-surface-dim: #cfdaf2;
            --color-outline: #777587;
            --color-outline-variant: #c7c4d8;
            --color-inverse-surface: #263143;
            --color-inverse-on-surface: #ecf1ff;
          }
        `;
        document.head.appendChild(styleTag);
        
        // Limpiar basura de Vite y Nuxt para Figma
        document.querySelectorAll('script:not([id="tailwind-config"]):not([src*="cdn.tailwindcss.com"])').forEach(el => el.remove());
        document.querySelectorAll('link[rel="stylesheet"][href*="_nuxt"]').forEach(el => el.remove());
        document.querySelectorAll('style[data-vite-dev-id]').forEach(el => el.remove());
        document.querySelectorAll('link[rel="modulepreload"]').forEach(el => el.remove());
        
        // Forzar modo claro o mantener variables CSS
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
    "###;

    // Lanzamos Chrome una vez, pero reabriremos el tab para limpiar sesi├│n (o usaremos incognito si es posible, 
    // pero crear un tab nuevo suele compartir cookies. Para limpiar cookies usaremos JS).
    let browser = Browser::new(LaunchOptions {
        headless: true,
        args: vec![std::ffi::OsStr::new("--force-device-scale-factor=1.4")],
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
            let _ = tab.evaluate(inject_figma_scripts, false);
            std::thread::sleep(Duration::from_millis(500));
            if let Ok(res) = tab.evaluate("document.documentElement.outerHTML", false) {
                if let Some(html) = res.value.and_then(|v| v.as_str().map(|s| s.to_string())) {
                    let full_html = format!("<!doctype html>\n{}", html);
                    let out_path = format!("{}/public_{}.html", output_dir, name);
                    let _ = fs::write(&out_path, full_html);
                    println!("Guardado: {}", out_path);
                }
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
                
                    let _ = tab.wait_until_navigated();
                    std::thread::sleep(Duration::from_secs(4)); // Tiempo para requests
                    
                    let _ = tab.evaluate(inject_figma_scripts, false);
                    std::thread::sleep(Duration::from_millis(500));
                    
                    if let Ok(res) = tab.evaluate("document.documentElement.outerHTML", false) {
                        if let Some(html) = res.value.and_then(|v| v.as_str().map(|s| s.to_string())) {
                            let full_html = format!("<!doctype html>\n{}", html);
                            let out_path = format!("{}/{}_{}.html", output_dir, group.role_name, name);
                            let _ = fs::write(&out_path, full_html);
                            println!("Guardado: {}", out_path);
                        }
                    }
                        }
                    }
                }
            }
        }
    }

    println!("¡Proceso completado!");
    Ok(())
}
