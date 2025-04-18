"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleLogin = async ({
    email,
    password,
  }: { email: string; password: string }) => {
    try {
      // Sign In With Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        alert({
          title: "Email has not been verified. A verification link has been sent.",
          variant: "destructive",
        });

        await sendEmailVerification(userCredential.user);
        return;
      } else {
        alert("Login successful. Signed in as " + userCredential.user.email);
      }
    } catch (error: unknown) {
      alert("Bad credentials.")
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email")?.toString() || "";
          const password = formData.get("password")?.toString() || "";
          handleLogin({ email, password });
        }}
        className="flex flex-col gap-4"
      >
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
