const {
    TELEGRAM_API_KEY,
    CRON_TIME_BETWEEN_CHECKS,
    PRODUCT_MANAGEMENT_BASE_URL,
    PRODUCT_MANAGEMENT_EMAIL,
    PRODUCT_MANAGEMENT_PASSWORD
} = process.env;

module.exports = {
    cronTimeBetweenChecks: CRON_TIME_BETWEEN_CHECKS || "0 * * * *", // Default every hour at 00
    telegramApiKey: TELEGRAM_API_KEY || '',
    productManagementURL: PRODUCT_MANAGEMENT_BASE_URL || "http://localhost:1337",
    productManagementEmail: PRODUCT_MANAGEMENT_EMAIL || "test@gmail.com",
    productManagementPassword: PRODUCT_MANAGEMENT_PASSWORD || "",
}