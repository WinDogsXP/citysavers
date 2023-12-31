"use client";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { AccountCircle, Map, Code } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MainNavbar() {
  const { status, data } = useSession();

  return (
    <AppBar position="fixed" component="nav" sx={{ zIndex: 1300 }}>
      <Toolbar
        sx={{
          gap: "0.5rem",
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CitySavers
        </Typography>
        {data?.user.role == "admin" ? (
          <Link href="/admin">
            <Button endIcon={<Code />} sx={{ color: "#fff" }}>
              Admin
            </Button>
          </Link>
        ) : (
          <></>
        )}
        <Link href="/map">
          <Button endIcon={<Map />} sx={{ color: "#fff" }}>
            Map
          </Button>
        </Link>
        {status === "authenticated" ? (
          <Link href="/account">
            <Button endIcon={<AccountCircle />} sx={{ color: "#fff" }}>
              Account
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button endIcon={<AccountCircle />} sx={{ color: "#fff" }}>
              Login
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
