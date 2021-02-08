#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();
import app from "./app/init.js";
app();