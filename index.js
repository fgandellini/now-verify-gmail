#!/usr/bin/env node

const puppeteer = require('puppeteer')

const args = process.argv.slice(2)
if (args.length !== 2) {
  console.error('Usage: node now-verify-gmail <email> <password>')
  return
}

const email = args[0]
const password = args[1]

async function login(page, email, password) {
  await page.goto('https://accounts.google.com')
  await page.type('input[type=email]', email)
  await page.click('div[role=button]#identifierNext')
  await page.waitFor(1000)
  await page.type('input[type=password]', password)
  await page.click('div[role=button]#passwordNext')
  await page.waitFor(1000)
}

async function openGmail(page) {
  await page.goto('https://mail.google.com')
  await page.waitFor(1000)
}

async function openLastEmail(page) {
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await page.waitFor(2000)
}

async function clickVerifyLink(page) {
  await page.evaluate(() =>
    [...document.querySelectorAll('a')]
      .filter(e => /VERIFY/.test(e.outerHTML))[0]
      .click()
  )
}

async function waitForVerification(page) {
  await page.waitFor(5000)
}

puppeteer.launch({ headless: false })
  .then(async browser => {
    const page = await browser.newPage()
    await login(page, email, password)
    await openGmail(page)
    await openLastEmail(page)
    await clickVerifyLink(page)    
    await waitForVerification(page)
    await browser.close()
  })
