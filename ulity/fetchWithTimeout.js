export async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    try {


        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        return false
    }
}