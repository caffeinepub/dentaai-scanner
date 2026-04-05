import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

const ISSUES = [
  {
    id: "T-201",
    user: "Priya M.",
    subject: "Scan result not loading",
    cat: "Scan Error",
    status: "Open",
    time: "2h ago",
  },
  {
    id: "T-202",
    user: "Arun K.",
    subject: "Can't log in with Internet Identity",
    cat: "Login",
    status: "Resolved",
    time: "3h ago",
  },
  {
    id: "T-203",
    user: "Sarah L.",
    subject: "Passport code not found",
    cat: "Passport",
    status: "Open",
    time: "4h ago",
  },
  {
    id: "T-204",
    user: "Meera T.",
    subject: "Booking confirmation not showing",
    cat: "Booking",
    status: "In Progress",
    time: "5h ago",
  },
  {
    id: "T-205",
    user: "David R.",
    subject: "3D arch not displaying",
    cat: "Scan Error",
    status: "Resolved",
    time: "6h ago",
  },
  {
    id: "T-206",
    user: "Sana V.",
    subject: "Emergency dentist list empty",
    cat: "Booking",
    status: "Open",
    time: "8h ago",
  },
];

const SATISFACTION_DATA = [
  { day: "Mon", score: 78 },
  { day: "Tue", score: 85 },
  { day: "Wed", score: 82 },
  { day: "Thu", score: 91 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 95 },
  { day: "Sun", score: 90 },
];

const COMMON_ISSUES = [
  { label: "Scan not loading", count: 18, pct: 72 },
  { label: "Login errors", count: 10, pct: 40 },
  { label: "Passport lookup fails", count: 7, pct: 28 },
  { label: "Booking confirmation", count: 5, pct: 20 },
  { label: "3D arch display", count: 3, pct: 12 },
];

const CAT_COLORS: Record<string, string> = {
  "Scan Error": "oklch(0.72 0.22 25)",
  Login: "oklch(0.82 0.18 205)",
  Passport: "oklch(0.72 0.2 280)",
  Booking: "oklch(0.82 0.18 75)",
};

const STATUS_COLORS: Record<string, string> = {
  Open: "oklch(0.72 0.22 25)",
  "In Progress": "oklch(0.82 0.18 75)",
  Resolved: "oklch(0.72 0.18 142)",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function SupportDashboardPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 60)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{
          background: "oklch(0.08 0.02 85 / 0.95)",
          borderBottom: "1px solid oklch(0.72 0.15 85 / 0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            style={{ color: "oklch(0.82 0.16 85)" }}
            data-ocid="support_dashboard.link"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.78 0.16 80 / 0.15)",
                border: "1px solid oklch(0.78 0.16 80 / 0.4)",
              }}
            >
              <MessageSquare
                className="w-5 h-5"
                style={{ color: "oklch(0.88 0.18 85)" }}
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gradient-gold">
                Support Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.55 0.06 80)" }}>
                Gain insights into how users experience your product
              </p>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: "oklch(0.72 0.15 85 / 0.12)",
            border: "1px solid oklch(0.72 0.15 85 / 0.35)",
            color: "oklch(0.75 0.12 85)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          8 OPEN TICKETS
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10 gap-8 max-w-6xl mx-auto w-full">
        {/* Stat Cards */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {[
            {
              icon: MessageSquare,
              label: "Open Tickets",
              value: "8",
              sub: "2 urgent",
              color: "25",
            },
            {
              icon: Clock,
              label: "Avg Response",
              value: "1.4h",
              sub: "This week",
              color: "85",
            },
            {
              icon: Star,
              label: "Satisfaction",
              value: "4.8/5",
              sub: "User rating",
              color: "85",
            },
            {
              icon: CheckCircle,
              label: "Resolved",
              value: "34",
              sub: "This week",
              color: "142",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.11 0.04 85 / 0.7)",
                border: `1px solid oklch(0.72 0.16 ${stat.color} / 0.3)`,
                boxShadow: `0 0 20px oklch(0.72 0.16 ${stat.color} / 0.08)`,
              }}
              data-ocid="support_dashboard.card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: `oklch(0.82 0.16 ${stat.color})` }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.50 0.05 80)" }}
                >
                  {stat.sub}
                </span>
              </div>
              <p
                className="font-display text-3xl font-bold"
                style={{ color: `oklch(0.85 0.16 ${stat.color})` }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.55 0.05 80)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Issues Table + Satisfaction Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Issues Table */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.035 85 / 0.7)",
              border: "1px solid oklch(0.72 0.15 85 / 0.2)",
            }}
          >
            <p className="font-display font-bold mb-5 text-gradient-gold">
              Recent Support Issues
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid oklch(0.72 0.15 85 / 0.15)",
                    }}
                  >
                    {["ID", "User", "Issue", "Category", "Status", "Time"].map(
                      (h) => (
                        <th
                          key={h}
                          className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide"
                          style={{ color: "oklch(0.55 0.05 80)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ISSUES.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: "1px solid oklch(0.72 0.15 85 / 0.08)",
                      }}
                      data-ocid={`support_dashboard.row.item.${i + 1}`}
                    >
                      <td
                        className="py-3 px-3 font-mono text-xs"
                        style={{ color: "oklch(0.65 0.08 85)" }}
                      >
                        {row.id}
                      </td>
                      <td
                        className="py-3 px-3 text-xs"
                        style={{ color: "oklch(0.80 0.06 85)" }}
                      >
                        {row.user}
                      </td>
                      <td
                        className="py-3 px-3 text-xs max-w-[140px] truncate"
                        style={{ color: "oklch(0.75 0.05 80)" }}
                      >
                        {row.subject}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            color: CAT_COLORS[row.cat],
                            background: `${CAT_COLORS[row.cat].replace(")", " / 0.15)")}`,
                          }}
                        >
                          {row.cat}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: STATUS_COLORS[row.status] }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td
                        className="py-3 px-3 text-xs"
                        style={{ color: "oklch(0.50 0.04 80)" }}
                      >
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Satisfaction Chart */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.035 85 / 0.7)",
              border: "1px solid oklch(0.72 0.15 85 / 0.2)",
            }}
          >
            <p className="font-display font-bold mb-1 text-gradient-gold">
              Satisfaction Trend
            </p>
            <p
              className="text-xs mb-5"
              style={{ color: "oklch(0.55 0.05 80)" }}
            >
              7-day NPS score
            </p>
            <div className="flex items-end gap-2 h-32 mb-4">
              {SATISFACTION_DATA.map((d, i) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="w-full rounded-t-md origin-bottom"
                    style={{
                      height: `${d.score}%`,
                      background:
                        "linear-gradient(180deg, oklch(0.82 0.18 85), oklch(0.62 0.14 80))",
                      opacity: 0.8,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.04 80)" }}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border-t pt-4"
              style={{ borderColor: "oklch(0.72 0.15 85 / 0.15)" }}
            >
              <p
                className="text-xs font-bold mb-3"
                style={{ color: "oklch(0.72 0.1 85)" }}
              >
                Common Issues
              </p>
              {COMMON_ISSUES.map((c) => (
                <div key={c.label} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "oklch(0.70 0.05 80)" }}>
                      {c.label}
                    </span>
                    <span style={{ color: "oklch(0.82 0.16 85)" }}>
                      {c.count}
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.18 0.04 85)" }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7 }}
                      className="h-full rounded-full origin-left"
                      style={{
                        width: `${c.pct}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
