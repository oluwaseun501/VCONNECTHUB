import React from "react";
import { motion } from "framer-motion";

const orbs = [
  {
    id: 1,
    size: 420,
    initialX: "8%",
    initialY: "15%",
    darkBg:  "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)",
    lightBg: "radial-gradient(circle, rgba(139,92,246,0.30) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
    animX: ["8%", "22%", "12%", "5%", "8%"],
    animY: ["15%", "30%", "55%", "25%", "15%"],
    duration: 22,
    delay: 0,
  },
  {
    id: 2,
    size: 340,
    initialX: "70%",
    initialY: "8%",
    darkBg:  "radial-gradient(circle, rgba(217,70,239,0.50) 0%, rgba(217,70,239,0.14) 50%, transparent 70%)",
    lightBg: "radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(217,70,239,0.07) 50%, transparent 70%)",
    animX: ["70%", "58%", "72%", "80%", "70%"],
    animY: ["8%",  "25%", "12%", "35%",  "8%"],
    duration: 18,
    delay: 3,
  },
  {
    id: 3,
    size: 300,
    initialX: "45%",
    initialY: "65%",
    darkBg:  "radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)",
    lightBg: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
    animX: ["45%", "35%", "55%", "42%", "45%"],
    animY: ["65%", "75%", "60%", "50%", "65%"],
    duration: 26,
    delay: 6,
  },
  {
    id: 4,
    size: 240,
    initialX: "85%",
    initialY: "55%",
    darkBg:  "radial-gradient(circle, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0.12) 50%, transparent 70%)",
    lightBg: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, rgba(167,139,250,0.06) 50%, transparent 70%)",
    animX: ["85%", "78%", "88%", "82%", "85%"],
    animY: ["55%", "40%", "65%", "48%", "55%"],
    duration: 20,
    delay: 1.5,
  },
  {
    id: 5,
    size: 220,
    initialX: "20%",
    initialY: "78%",
    darkBg:  "radial-gradient(circle, rgba(232,121,249,0.40) 0%, rgba(232,121,249,0.10) 50%, transparent 70%)",
    lightBg: "radial-gradient(circle, rgba(232,121,249,0.20) 0%, rgba(232,121,249,0.05) 50%, transparent 70%)",
    animX: ["20%", "28%", "15%", "22%", "20%"],
    animY: ["78%", "65%", "82%", "70%", "78%"],
    duration: 28,
    delay: 4,
  },
];

export default function AnimatedOrbs({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>

      {/* Dark mode orbs */}
      <div className="hidden dark:block absolute inset-0">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              left: orb.initialX,
              top: orb.initialY,
              transform: "translate(-50%, -50%)",
              background: orb.darkBg,
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
            animate={{
              left: orb.animX,
              top:  orb.animY,
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        ))}
      </div>

      {/* Light mode orbs */}
      <div className="block dark:hidden absolute inset-0">
        {orbs.map((orb) => (
          <motion.div
            key={`light-${orb.id}`}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              left: orb.initialX,
              top: orb.initialY,
              transform: "translate(-50%, -50%)",
              background: orb.lightBg,
              filter: "blur(50px)",
              borderRadius: "50%",
            }}
            animate={{
              left: orb.animX,
              top:  orb.animY,
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        ))}
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}