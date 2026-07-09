import { defineNuxtPlugin } from "#imports";

// Apply global Object.create null prototype hasOwnProperty patch on load with try-catch safety
if (typeof Object.create === "function") {
  const originalCreate = Object.create;
  Object.create = function (proto: any, propertiesObject?: any) {
    const obj = originalCreate(proto, propertiesObject);
    if (proto === null) {
      try {
        Object.defineProperty(obj, "hasOwnProperty", {
          value: function (prop: string | symbol) {
            return Object.prototype.hasOwnProperty.call(this, prop);
          },
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        // Ignore errors on non-configurable/frozen objects
      }
    }
    return obj;
  };
}

export default defineNuxtPlugin(() => {
  // Plugin loaded
});
