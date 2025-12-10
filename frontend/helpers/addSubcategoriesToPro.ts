
export async function addSubcategoriesToPro(subcategoryIds: number[]) {
    const res = await fetch("http://localhost:5221/api/user/set-subcategories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        // Если ничего не выбрано, отправляем пустой массив (очистка) или блокируем кнопку
        body: JSON.stringify(subcategoryIds)
    });
    if (!res.ok) {
        return { success: false, message: 'Ошибка при обновлении подкатегорий' };
    }

    return { success: true };
}