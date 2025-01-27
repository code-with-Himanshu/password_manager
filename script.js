// Encryption key
const key = "secret-key"; 

// Predefined login credentials
const validUsername = "admin"; 
const validPassword = "password123"; 

/**
 * Encrypts text using AES encryption.
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text.
 */
function encrypt(text) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

/**
 * Decrypts AES encrypted text.
 * @param {string} ciphertext - The encrypted text.
 * @returns {string} - The decrypted text.
 */
function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Handles login functionality.
 */
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (username === validUsername && password === validPassword) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('password-manager').style.display = 'block';
    loadPasswords();
  } else {
    const error = document.getElementById('login-error');
    error.style.display = 'block';
    setTimeout(() => error.style.display = 'none', 3000);
  }
}

/**
 * Saves passwords to localStorage.
 * @param {Array} passwords - The array of password objects.
 */
function savePasswordsToLocalStorage(passwords) {
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

/**
 * Retrieves passwords from localStorage.
 * @returns {Array} - The array of stored password objects.
 */
function getPasswordsFromLocalStorage() {
  const passwords = localStorage.getItem('passwords');
  return passwords ? JSON.parse(passwords) : [];
}

/**
 * Loads passwords into the table.
 */
function loadPasswords() {
  const passwords = getPasswordsFromLocalStorage();
  const passwordList = document.getElementById('password-list');
  passwordList.innerHTML = '';

  passwords.forEach(({ website, username, password }) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${website}</td>
      <td>${username}</td>
      <td>
        <span class="password-field" style="display: none;">${decrypt(password)}</span>
        <span class="password-toggle" onclick="togglePassword(this, '${password}')">👁️</span>
      </td>
      <td><button class="delete-btn" onclick="deletePassword(this)">Delete</button></td>
    `;
    passwordList.appendChild(tableRow);
  });
}

/**
 * Adds a new password entry.
 */
function addPassword() {
  const website = document.getElementById('website').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!website || !username || !password) {
    alert('Please fill out all fields');
    return;
  }

  const encryptedPassword = encrypt(password);

  const passwords = getPasswordsFromLocalStorage();
  passwords.push({ website, username, password: encryptedPassword });
  savePasswordsToLocalStorage(passwords);
  loadPasswords();

  // Clear inputs
  document.getElementById('website').value = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

/**
 * Toggles password visibility.
 * @param {HTMLElement} element - The toggle button element.
 * @param {string} encryptedPassword - The encrypted password.
 */
function togglePassword(element, encryptedPassword) {
  const passwordField = element.previousElementSibling;
  if (passwordField.style.display === 'none') {
    passwordField.textContent = decrypt(encryptedPassword);
    passwordField.style.display = 'inline';
    element.textContent = '🙈';
  } else {
    passwordField.style.display = 'none';
    element.textContent = '👁️';
  }
}

/**
 * Deletes a password entry.
 * @param {HTMLElement} button - The delete button element.
 */
function deletePassword(button) {
  const row = button.parentElement.parentElement;
  const website = row.children[0].textContent;
  const username = row.children[1].textContent;

  let passwords = getPasswordsFromLocalStorage();
  passwords = passwords.filter(p => p.website !== website || p.username !== username);
  savePasswordsToLocalStorage(passwords);
  loadPasswords();
}
