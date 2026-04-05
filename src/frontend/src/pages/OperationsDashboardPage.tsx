import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Server,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const HEALTH_ITEMS = [
  { label: "Backend Canister", status: "Healthy", color: "142", dot: "green" },
  { label: "AI Pipeline", status: "Active", color: "142", dot: "green" },
  { label: "ICP Database", status: "Synced", color: "142", dot: "green" },
  { label: "CDN / Assets", status: "Online", color: "142", dot: "green" },
  { label: "Auth Service", status: "Operational", color: "142", dot: "green" },
  { label: "3D Renderer", status: "Active", color: "75", dot: "yellow" },
];

const EVENTS = [
  {
    time: "10:42 AM",
    msg: "Canister heartbeat: 47 active sessions",
    type: "info",
  },
  {
    time: "10:38 AM",
    msg: "AI scan pipeline processed 12 requests",
    type: "success",
  },
  {
    time: "10:31 AM",
    msg: "Passport lookup: 3 queries resolved",
    type: "info",
  },
  {
    time: "10:22 AM",
    msg: "Booking system: 2 new appointments confirmed",
    type: "success",
  },
  {
    time: "10:15 AM",
    msg: "CDN cache refreshed (28 assets updated)",
    type: "info",
  },
  {
    time: "09:58 AM",
    msg: "Minor latency spike: 1.8s avg (resolved)",
    type: "warn",
  },
  {
    time: "09:45 AM",
    msg: "Stable memory checkpoint written",
    type: "success",
  },
];

const BOTTLENECKS = [
  {
    label: "3D Render Time",
    value: "380ms",
    status: "warn",
    note: "Above 300ms target",
  },
  {
    label: "Passport Lookup",
    value: "120ms",
    status: "ok",
    note: "Within threshold",
  },
  {
    label: "Scan Processing",
    value: "1.8s",
    status: "ok",
    note: "Within 2s target",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function OperationsDashboardPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 280)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{
          background: "oklch(0.08 0.02 280 / 0.95)",
          borderBottom: "1px solid oklch(0.62 0.2 280 / 0.25)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            style={{ color: "oklch(0.72 0.2 280)" }}
            data-ocid="operations_dashboard.link"
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
                background: "oklch(0.62 0.2 280 / 0.15)",
                border: "1px solid oklch(0.62 0.2 280 / 0.4)",
              }}
            >
              <Server
                className="w-5 h-5"
                style={{ color: "oklch(0.72 0.2 280)" }}
              />
            </div>
            <div>
              <h1
                className="font-display font-bold text-lg"
                style={{ color: "oklch(0.72 0.2 280)" }}
              >
                Operations Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.52 0.10 280)" }}>
                Monitor automations and workflows
              </p>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: "oklch(0.62 0.2 280 / 0.1)",
            border: "1px solid oklch(0.62 0.2 280 / 0.3)",
            color: "oklch(0.65 0.16 280)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          ALL SYSTEMS GO
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
              icon: Activity,
              label: "Uptime",
              value: "99.97%",
              sub: "Last 30 days",
              color: "142",
            },
            {
              icon: Zap,
              label: "Active Scans",
              value: "47",
              sub: "Right now",
              color: "280",
            },
            {
              icon: Clock,
              label: "Avg Response",
              value: "1.2s",
              sub: "API latency",
              color: "280",
            },
            {
              icon: AlertTriangle,
              label: "Error Rate",
              value: "0.03%",
              sub: "All requests",
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
                background: "oklch(0.10 0.04 280 / 0.7)",
                border: `1px solid oklch(0.62 0.2 ${stat.color} / 0.3)`,
                boxShadow: `0 0 20px oklch(0.62 0.2 ${stat.color} / 0.08)`,
              }}
              data-ocid="operations_dashboard.card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: `oklch(0.72 0.18 ${stat.color})` }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.50 0.06 280)" }}
                >
                  {stat.sub}
                </span>
              </div>
              <p
                className="font-display text-3xl font-bold"
                style={{ color: `oklch(0.80 0.18 ${stat.color})` }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.55 0.05 280)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* System Health + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* System Health */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 280 / 0.7)",
              border: "1px solid oklch(0.62 0.2 280 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-5"
              style={{ color: "oklch(0.72 0.2 280)" }}
            >
              System Health
            </p>
            <div className="flex flex-col gap-3">
              {HEALTH_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: "oklch(0.12 0.04 280 / 0.5)",
                    border: `1px solid oklch(0.62 0.2 ${item.color} / 0.2)`,
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.75 0.06 280)" }}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background:
                          item.dot === "green"
                            ? "oklch(0.72 0.18 142)"
                            : "oklch(0.82 0.18 75)",
                      }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          item.dot === "green"
                            ? "oklch(0.72 0.18 142)"
                            : "oklch(0.82 0.18 75)",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Events */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.09 0.04 280 / 0.7)",
              border: "1px solid oklch(0.62 0.2 280 / 0.2)",
            }}
          >
            <p
              className="font-display font-bold mb-5"
              style={{ color: "oklch(0.72 0.2 280)" }}
            >
              Recent Events
            </p>
            <div className="flex flex-col gap-2">
              {EVENTS.map((e, i) => (
                <motion.div
                  key={`event-${e.time}-${e.msg.slice(0, 10)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 items-start py-2"
                  style={{
                    borderBottom:
                      i < EVENTS.length - 1
                        ? "1px solid oklch(0.62 0.2 280 / 0.1)"
                        : "none",
                  }}
                  data-ocid={`operations_dashboard.item.${i + 1}`}
                >
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{ color: "oklch(0.50 0.06 280)" }}
                  >
                    {e.time}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color:
                        e.type === "success"
                          ? "oklch(0.72 0.18 142)"
                          : e.type === "warn"
                            ? "oklch(0.82 0.18 75)"
                            : "oklch(0.70 0.06 280)",
                    }}
                  >
                    {e.msg}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottleneck Warnings */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full rounded-2xl p-6"
          style={{
            background: "oklch(0.09 0.04 280 / 0.7)",
            border: "1px solid oklch(0.62 0.2 280 / 0.2)",
          }}
        >
          <p
            className="font-display font-bold mb-5"
            style={{ color: "oklch(0.72 0.2 280)" }}
          >
            Performance Bottlenecks
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOTTLENECKS.map((b) => (
              <div
                key={b.label}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: "oklch(0.12 0.04 280 / 0.5)",
                  border: `1px solid oklch(${b.status === "warn" ? "0.82 0.18 75" : "0.62 0.18 142"} / 0.3)`,
                }}
              >
                <div className="flex justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.06 280)" }}
                  >
                    {b.label}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        b.status === "warn"
                          ? "oklch(0.82 0.18 75)"
                          : "oklch(0.72 0.18 142)",
                    }}
                  >
                    {b.value}
                  </span>
                </div>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.50 0.04 280)" }}
                >
                  {b.note}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
