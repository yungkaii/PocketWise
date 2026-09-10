# FinTrack Pro

PocketWise— FRONTEND DEVELOPMENT SPECIFICATION

Bertindak sebagai Senior Front-End Developer + Senior UI/UX Designer.

Saya sedang membangun aplikasi Personal Finance Management bernama FinTrack menggunakan React + TypeScript + Vite.

PENTING — DEVELOPMENT MODE

Project ini KHUSUS FRONTEND.

Backend, database, authentication API, dan REST API akan dikerjakan oleh developer lain.

Karena itu:

Jangan membuat backend.

Jangan membuat database.

Jangan membuat server.

Jangan membuat API sungguhan.

Jangan menambahkan Supabase/Firebase sebagai backend.

Jangan membuat Prisma.

Jangan membuat Express.

Gunakan mock data dan local state.

Struktur kode harus API-ready, sehingga backend nantinya dapat dihubungkan tanpa perlu melakukan redesign frontend.

PRIORITAS UTAMA

Prioritas project:

UI/UX

Visual quality

Responsive design

Component architecture

Reusable components

Clean code

API-ready structure

Jangan terlalu fokus pada backend functionality karena backend belum dibuat.

DESIGN DIRECTION

Buat aplikasi dengan visual seperti modern fintech SaaS application.

Style:

modern

premium

clean

minimal

elegant

professional

fresh

data-driven

Hindari:

dashboard template yang generik

terlalu banyak card

warna berlebihan

gradient berlebihan

shadow berlebihan

layout yang terlalu padat

Gunakan whitespace dan visual hierarchy dengan baik.

Support:

Light Mode

Dark Mode

System Mode

CORE FEATURES

1. DASHBOARD

Dashboard harus menampilkan:

Total Balance

Total saldo seluruh akun.

Contoh:

Rp 6.350.000

User dapat hide/show balance.

Account Summary

Cash

Bank

E-Wallet

Monthly Cash Flow

Income

Expense

Net Cash Flow

Expense Distribution

Donut / Pie Chart.

Kategori:

Food

Transport

Rent

Bills

Entertainment

Shopping

Other

Income vs Expense

Bar / Line Chart.

Filter:

This Week

This Month

Last Month

Custom Range

Recent Transactions

Tampilkan transaksi terbaru.

Budget Overview

Tampilkan budget dan progress:

Healthy

Warning

Exceeded

2. TRANSACTIONS

Buat halaman transaksi.

Desktop:

Table.

Mobile:

Responsive Card/List.

Fitur:

Search

Filter

Sorting

Pagination

Add Transaction

Edit Transaction

Delete Transaction

Transaction Details

Filter:

Type

Category

Account

Month

Year

Date Range

3. ADD TRANSACTION

Form:

Income / Expense

Amount

Category

Account

Date

Time

Note

Gunakan:

React Hook Form

Zod

Validation yang baik.

Setelah submit:

show toast

update mock state

update dashboard

update transaction list

update budget calculation

4. ACCOUNTS

User dapat mengelola:

Cash

Bank

E-Wallet

Actions:

Add

Edit

Delete

Fields:

Name

Type

Balance

Icon

Color

5. CATEGORIES

User dapat:

Add category

Edit category

Delete category

Fields:

Name

Type

Icon

Color

6. BUDGETS

User dapat membuat monthly budget.

Fields:

Category

Monthly Limit

Month

Year

Tampilkan:

Budget

Spent

Remaining

Progress

Status

Status logic:

0–79% = Healthy

80–99% = Warning

100%+ = Exceeded

7. ANALYTICS

Buat halaman analytics.

Tampilkan:

Total Income

Total Expense

Net Income

Average Daily Expense

Spending by Category

Income vs Expense

Spending Trend

Top Spending Categories

Tambahkan insight sederhana berdasarkan mock data.

Contoh:

"Food spending increased 18% compared to last month."

8. REPORTS

Buat halaman report.

User dapat memilih:

Date Range

Category

Account

Transaction Type

Tampilkan summary.

Tambahkan tombol:

Export Excel

Export PDF

Untuk sekarang gunakan frontend implementation / mock behavior.

9. SETTINGS

Tampilkan:

Profile

Appearance

Currency

Preferences

Notifications

OPTIONAL FEATURES

Selain fitur inti di atas, kamu BOLEH menambahkan fitur tambahan apabila benar-benar meningkatkan UX aplikasi.

Contoh:

Quick Add Transaction

Recurring Transactions

Financial Goals

Savings Goals

Notification Center

Account Transfer

Calendar View

Global Search

Monthly Summary

Spending Alerts

Net Worth

Savings Rate

Financial Health Score

Dashboard Customization

Namun:

Jangan menambahkan fitur hanya supaya project terlihat lebih besar.

Tambahkan hanya fitur yang:

relevan

useful

tidak membuat UX rumit

dapat berjalan menggunakan mock data

tidak membutuhkan backend

Untuk setiap fitur tambahan yang kamu tambahkan, beri komentar singkat di code atau dokumentasi mengenai tujuan fitur tersebut.

COMPONENT ARCHITECTURE

Gunakan reusable components.

Contoh:

DashboardSummary

BalanceCard

CashFlowCard

ExpenseChart

IncomeExpenseChart

RecentTransactions

BudgetProgress

TransactionTable

TransactionFilters

TransactionForm

CategoryForm

BudgetForm

AccountCard

ConfirmDialog

Toast

Modal

Drawer

FOLDER STRUCTURE

Gunakan struktur:

src/

├── assets/

├── components/

│ ├── ui/

│ ├── charts/

│ └── common/

│
├── layouts/

│ ├── AuthLayout.tsx
│ ├── DashboardLayout.tsx
│ └── components/
│
├── pages/

│ ├── auth/
│ ├── dashboard/
│ ├── transactions/
│ ├── accounts/
│ ├── categories/
│ ├── budgets/
│ ├── analytics/
│ ├── reports/
│ └── settings/
│
├── features/

│ ├── transactions/
│ ├── accounts/
│ ├── categories/
│ ├── budgets/
│ └── analytics/
│
├── services/

├── api/

├── hooks/

├── contexts/

├── data/

├── types/

├── utils/

├── constants/

├── routes/

├── lib/

├── App.tsx

└── main.tsx

API-READY ARCHITECTURE

Jangan melakukan API request langsung dari component.

Gunakan service layer.

Contoh:

transactionService

accountService

categoryService

budgetService

reportService

authService

Method contoh:

getTransactions()

createTransaction()

updateTransaction()

deleteTransaction()

getAccounts()

createAccount()

updateAccount()

deleteAccount()

getCategories()

createCategory()

updateCategory()

deleteCategory()

getBudgets()

createBudget()

updateBudget()

deleteBudget()

Backend developer nantinya cukup mengganti implementation service tersebut.

MOCK DATA

Gunakan centralized mock data.

Buat dataset yang cukup banyak agar dapat menguji:

filtering

searching

sorting

pagination

charts

budgets

analytics

Jangan menyebarkan mock data langsung ke berbagai component.

UX REQUIREMENTS

Setiap halaman harus memiliki:

Loading State

Empty State

Error State

Success State

Confirmation State

Tambahkan:

Skeleton loading

Toast

Confirmation dialog

Hover state

Focus state

Disabled state

Responsive state

RESPONSIVE DESIGN

Mobile-first.

Desktop:

Sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Bottom navigation atau mobile drawer.

Mobile navigation:

Dashboard

Transactions

Add

Budgets

More

Pastikan semua:

table responsive

chart responsive

modal responsive

form mobile friendly

button touch friendly

CURRENCY

Gunakan:

IDR / Rupiah

Locale:

id-ID

Contoh:

Rp 1.500.000

ICONS

Gunakan Lucide React.

IMPORTANT LOVABLE RULES

Karena project akan dikembangkan secara bertahap, ikuti aturan berikut:

RULE 1

Jangan mengubah file yang tidak berhubungan dengan task yang sedang dikerjakan.

RULE 2

Sebelum melakukan perubahan besar, pahami struktur project yang sudah ada.

RULE 3

Gunakan component yang sudah ada daripada membuat component baru yang duplikatif.

RULE 4

Jangan melakukan refactor besar kecuali benar-benar diperlukan.

RULE 5

Jangan mengganti technology stack tanpa alasan kuat.

RULE 6

Pertahankan visual consistency dengan halaman yang sudah ada.

RULE 7

Jangan merusak fitur yang sudah bekerja.

RULE 8

Kerjakan perubahan dalam scope sekecil mungkin.

RULE 9

Jika sebuah fitur membutuhkan perubahan pada beberapa component, ubah hanya file yang benar-benar dibutuhkan.

RULE 10

Jangan membuat ulang seluruh project hanya karena ada satu perubahan kecil.

DEVELOPMENT PHASES

Kerjakan project secara bertahap.

PHASE 1 — FOUNDATION

Buat:

project structure

design system

typography

colors

theme

routing

layout

sidebar

header

mobile navigation

reusable UI components

mock data architecture

Jangan membuat seluruh fitur sekaligus.

PHASE 2 — DASHBOARD

Implement:

Balance

Accounts summary

Cash flow

Expense chart

Income vs Expense chart

Recent transactions

Budget overview

PHASE 3 — TRANSACTIONS

Implement:

Transaction table

Search

Filter

Sorting

Pagination

Add transaction

Edit

Delete

Transaction details

PHASE 4 — ACCOUNTS & CATEGORIES

Implement:

Account management

Category management

Forms

CRUD interactions

PHASE 5 — BUDGET

Implement:

Create budget

Edit budget

Delete budget

Progress

Warning states

Exceeded states

PHASE 6 — ANALYTICS

Implement:

charts

spending trend

category breakdown

financial insights

PHASE 7 — REPORTS

Implement:

report filters

summary

export UI

PHASE 8 — SETTINGS

Implement:

profile

theme

currency

preferences

notifications

MOST IMPORTANT

Jangan mencoba menyelesaikan semua phase dalam satu perubahan besar.

Kerjakan hanya phase/task yang saya minta pada saat itu.

Ketika saya memberikan task baru, pertahankan seluruh functionality yang sudah ada.

Sebelum mengubah code:

Identifikasi file yang perlu diubah.

Reuse component yang sudah ada.

Ubah sesedikit mungkin file.

Jangan melakukan unnecessary refactor.

Pastikan perubahan tetap responsive.

Pastikan tidak merusak fitur sebelumnya.

Tujuan akhirnya adalah membuat PocketWise menjadi aplikasi personal finance frontend yang polished, scalable, responsive, dan siap diintegrasikan dengan backend developer lain.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f7e248d2-ab1c-4025-b48c-65c4b8207003).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
