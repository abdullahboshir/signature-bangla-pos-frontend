import AccountList from "./accounting/AccountList";
import BudgetList from "./accounting/BudgetList";
import ExpenseList from "./accounting/ExpenseList";
import TransactionList from "./accounting/TransactionList";

import AffiliateList from "./marketing/AffiliateList";
import AudienceList from "./marketing/AudienceList";
import CampaignList from "./marketing/CampaignList";
import CouponList from "./marketing/CouponList";
import EventList from "./marketing/EventList";
import PixelList from "./marketing/PixelList";
import PromotionList from "./marketing/PromotionList";
import SeoSettings from "./marketing/SeoSettings";

import CourierList from "./logistics/CourierList";
import ParcelList from "./logistics/ParcelList";

import AssetList from "./hrm/AssetList";
import AttendanceList from "./hrm/AttendanceList";
import DepartmentList from "./hrm/DepartmentList";
import DesignationList from "./hrm/DesignationList";
import LeaveList from "./hrm/LeaveList";
import PayrollList from "./hrm/PayrollList";
import StaffList from "./hrm/StaffList";

import ContentList from "./content/ContentList";

import BlacklistList from "./risk/BlacklistList";
import FraudDetectionList from "./risk/FraudDetectionList";
import RiskProfileList from "./risk/RiskProfileList";
import RiskRulesList from "./risk/RiskRulesList";

import ChatInterface from "./support/ChatInterface";
import DisputeList from "./support/DisputeList";
import TicketList from "./support/TicketList";

import ApiKeyList from "./system/ApiKeyList";
import AuditLogList from "./system/AuditLogList";
import BackupList from "./system/BackupList";
import CurrencyList from "./system/CurrencyList";
import EmailTemplateList from "./system/EmailTemplateList";
import LanguageList from "./system/LanguageList";
import NotificationList from "./system/NotificationList";
import SmsTemplateList from "./system/SmsTemplateList";
import WebhookList from "./system/WebhookList";
import ZoneList from "./system/ZoneList";

import LandingPageList from "./storefront/LandingPageList";
import PluginList from "./storefront/PluginList";
import ThemeList from "./storefront/ThemeList";
import QuestionList from "./storefront/QuestionList";

// Map route segments to Components
export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    // Accounting
    "accounting/accounts": AccountList,
    "accounting/budgets": BudgetList,
    "accounting/expenses": ExpenseList,
    "accounting/transactions": TransactionList,

    // Marketing
    "marketing/affiliates": AffiliateList,
    "marketing/campaigns": CampaignList,
    "marketing/coupons": CouponList,
    "marketing/promotions": PromotionList,
    "marketing/seo": SeoSettings,
    "marketing/audiences": AudienceList,
    "marketing/pixel": PixelList,

    // Logistics
    "logistics/courier": CourierList,
    "logistics/parcel": ParcelList,

    // HRM
    "hrm/assets": AssetList,
    "hrm/attendance": AttendanceList,
    "hrm/departments": DepartmentList,
    "hrm/designations": DesignationList,
    "hrm/leave": LeaveList,
    "hrm/payroll": PayrollList,
    "hrm/staff": StaffList,

    // Content
    "content": ContentList,

    // Risk
    "risk/fraud": FraudDetectionList,
    "risk/blacklist": BlacklistList,
    "risk/rules": RiskRulesList,

    // Support
    "support/chat": ChatInterface,
    "support/disputes": DisputeList,
    "support/tickets": TicketList,

    // System
    "system/api-keys": ApiKeyList,
    "system/audit-logs": AuditLogList,
    "system/backups": BackupList,
    "system/currencies": CurrencyList,
    "system/email-templates": EmailTemplateList,
    "system/languages": LanguageList,
    "system/notifications": NotificationList,
    "system/sms-templates": SmsTemplateList,
    "system/webhooks": WebhookList,
    "system/zones": ZoneList,

    // Storefront (online-store)
    "online-store/landing-pages": LandingPageList,
    "online-store/plugins": PluginList,
    "online-store/themes": ThemeList,
};
