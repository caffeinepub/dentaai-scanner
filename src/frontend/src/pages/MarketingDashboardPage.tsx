import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  MousePointer,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const TRAFFIC_DATA = [
  { day: "Mon", visits: 1420, pct: 55 },
  { day: "Tue", visits: 1860, pct: 72 },
  { day: "Wed", visits: 2140, pct: 83 },
  { day: "Thu", visits: 1750, pct: 68 },
  { day: "Fri", visits: 2580, pct: 100 },
  { day: "Sat", visits: 1980, pct: 77 },
  { day: "Sun", visits: 1117, pct: 43 },
];

const TOP_CONTENT = [
  { page: "/home", views: "4,320", bounce: "28%", avgTime: "3m 12s" },
  { page: "/scan", views: "3,840", bounce: "12%", avgTime: "5m 44s" },
  { page: "/demo", views: "2,110", bounce: "22%", avgTime: "4m 08s" },
  { page: "/find-dentist", views: "1,560", bounce: "35%", avgTime: "2m 30s" },
  { page: "/pitch", views: "1,017", bounce: "42%", avgTime: "1m 55s" },
];

const CTA_DATA = [
  { label: "Start Free Scan", pct: 41 },
  { label: "Watch Demo", pct: 22 },
  { label: "Find Dentist", pct: 17 },
  { label: "Get My Passport", pct: 12 },
  { label: "Our Pitch", pct: 8 },
];

const SOURCES = [
  { label: "Organic Search", pct: 48 },
  { label: "Direct", pct: 26 },
  { label: "Social Media", pct: 15 },
  { label: "Referral", pct: 11 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function MarketingDashboardPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 80)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{
          background: "oklch(0.08 0.02 220 / 0.95)",
          borderBottom: "1px solid oklch(0.88 0.18 85 / 0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="marketing_dashboard.link"
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
                background: "oklch(0.88 0.18 85 / 0.15)",
                border: "1px solid oklch(0.88 0.18 85 / 0.4)",
              }}
            >
              <BarChart2
                className="w-5 h-5"
                style={{ color: "oklch(0.88 0.18 85)" }}
              />
            </div>
            <div>
              <h1
                className="font-display font-bold text-lg"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                Marketing Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.65 0.12 78)" }}>
                Analyze traffic and content engagement
              </p>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: "oklch(0.88 0.18 85 / 0.1)",
            border: "1px solid oklch(0.88 0.18 85 / 0.3)",
            color: "oklch(0.82 0.16 82)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
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
              icon: Users,
              label: "Total Visitors",
              value: "12,847",
              change: "+18%",
              color: "205",
            },
            {
              icon: MousePointer,
              label: "Conversion Rate",
              value: "3.2%",
              change: "+0.4%",
              color: "205",
            },
            {
              icon: TrendingUp,
              label: "Avg Session",
              value: "2m 14s",
              change: "+22s",
              color: "205",
            },
            {
              icon: Users,
              label: "Newsletter Subs",
              value: "1,204",
              change: "+84",
              color: "205",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.10 0.04 220 / 0.8)",
                border: `1px solid oklch(0.82 0.16 ${stat.color} / 0.3)`,
                boxShadow: `0 0 20px oklch(0.82 0.16 ${stat.color} / 0.08)`,
              }}
              data-ocid="marketing_dashboard.card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: `oklch(0.82 0.16 ${stat.color})` }}
                />
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.55 0.14 142 / 0.2)",
                    color: "oklch(0.72 0.18 142)",
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <p
                className="font-display text-3xl font-bold"
                style={{ color: `oklch(0.88 0.18 ${stat.color})` }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.65 0.10 78)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Traffic Chart + Top CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* 7-Day Traffic Chart */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 220 / 0.8)",
              border: "1px solid oklch(0.88 0.18 85 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-1"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              7-Day Traffic
            </p>
            <p
              className="text-xs mb-5"
              style={{ color: "oklch(0.65 0.12 78)" }}
            >
              Daily unique visitors
            </p>
            <div className="flex items-end gap-2 h-40">
              {TRAFFIC_DATA.map((d, i) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="w-full rounded-t-md origin-bottom"
                    style={{
                      height: `${d.pct}%`,
                      background:
                        "linear-gradient(180deg, oklch(0.88 0.18 85), oklch(0.65 0.17 72))",
                      opacity: 0.8,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.60 0.10 75)" }}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top CTAs */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 220 / 0.8)",
              border: "1px solid oklch(0.88 0.18 85 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-1"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Top CTAs
            </p>
            <p
              className="text-xs mb-5"
              style={{ color: "oklch(0.65 0.12 78)" }}
            >
              Click-through by button
            </p>
            <div className="flex flex-col gap-3">
              {CTA_DATA.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "oklch(0.82 0.14 80)" }}>
                      {c.label}
                    </span>
                    <span style={{ color: "oklch(0.88 0.18 85)" }}>
                      {c.pct}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.15 0.04 80)" }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full origin-left"
                      style={{
                        width: `${c.pct}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.88 0.18 85), oklch(0.72 0.19 78))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Content Table + Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 220 / 0.8)",
              border: "1px solid oklch(0.88 0.18 85 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-5"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Top Content Pages
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid oklch(0.88 0.18 85 / 0.15)",
                    }}
                  >
                    {["Page", "Views", "Bounce", "Avg Time"].map((h) => (
                      <th
                        key={h}
                        className="py-2 px-3 text-left text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "oklch(0.65 0.12 78)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_CONTENT.map((row, i) => (
                    <tr
                      key={row.page}
                      style={{
                        borderBottom: "1px solid oklch(0.88 0.18 85 / 0.08)",
                      }}
                      data-ocid={`marketing_dashboard.row.item.${i + 1}`}
                    >
                      <td
                        className="py-3 px-3 font-mono text-xs"
                        style={{ color: "oklch(0.88 0.18 85)" }}
                      >
                        {row.page}
                      </td>
                      <td
                        className="py-3 px-3 text-xs"
                        style={{ color: "oklch(0.85 0.14 82)" }}
                      >
                        {row.views}
                      </td>
                      <td
                        className="py-3 px-3 text-xs"
                        style={{ color: "oklch(0.70 0.08 25)" }}
                      >
                        {row.bounce}
                      </td>
                      <td
                        className="py-3 px-3 text-xs"
                        style={{ color: "oklch(0.75 0.08 142)" }}
                      >
                        {row.avgTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Sources */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 220 / 0.8)",
              border: "1px solid oklch(0.88 0.18 85 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-1"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Traffic Sources
            </p>
            <p
              className="text-xs mb-5"
              style={{ color: "oklch(0.65 0.12 78)" }}
            >
              Signup origin breakdown
            </p>
            <div className="flex flex-col gap-4">
              {SOURCES.map((s, i) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "oklch(0.82 0.14 80)" }}>
                      {s.label}
                    </span>
                    <span style={{ color: "oklch(0.88 0.18 85)" }}>
                      {s.pct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.15 0.04 80)" }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full origin-left"
                      style={{
                        width: `${s.pct}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.88 0.18 85), oklch(0.72 0.19 78))",
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
