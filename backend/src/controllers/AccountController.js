import { AccountService } from '../services/AccountService.js';

const accountService = new AccountService();

export class AccountController {
  async register(req, res) {
    try {
      const account = req.body;
      if (!account.username || !account.password || !account.email || !account.role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      if (!['admin', 'abogada', 'lector'].includes(account.role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
    
      // Validar que el nombre de usuario tenga al menos 8 caracteres y solo letras
if (account.username) {
  const usernameRegex = /^[A-Za-z]{8,}$/;

  if (!usernameRegex.test(account.username)) {
    return res.status(400).json({
      message: 'El nombre de usuario debe tener al menos 8 letras y solo puede contener letras sin espacios ni números'
    });
  }
}

      
      // Validate phone number format if provided
      if (account.phone_number && !/^\+?[1-9]\d{1,14}$/.test(account.phone_number)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
      
      //Validare email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (account.email && !emailRegex.test(account.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Create the account
      const newAccount = await accountService.register(account);
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

 async login(req, res) {
  try {
    const { username, password } = req.body;

    // Validar que el username solo tenga letras
    const onlyLettersRegex = /^[A-Za-z]+$/;
    if (!onlyLettersRegex.test(username)) {
      return res.status(400).json({ message: 'Username must contain only letters (no numbers or special characters).' });
    }

    const result = await accountService.login(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}


  async recoverPassword(req, res) {
    try {
      const { email } = req.body;
      await accountService.recoverPassword(email);
      res.status(200).json({ message: 'Recovery email sent' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async modifyProfile(req, res) {
    try {
      const account_id = req.user.id;
      const profileData = req.body;

            // Validar formato y dominio del correo
      if (profileData.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'espe.ec.edu.ec'];

        if (!emailRegex.test(profileData.email)) {
          return res.status(400).json({ message: 'Invalid email format' });
        }

        const domain = profileData.email.split('@')[1];
        if (!allowedDomains.includes(domain)) {
          return res.status(400).json({ message: `Email domain '${domain}' is not allowed` });
        }
      }

      // Validar que la contraseña tenga al menos 8 caracteres
      if (profileData.password && profileData.password.length < 8) {    
        return res.status(400).json({ message: 'la contrseaña debe tener 8 carcateres minimo' });
      }



      // Validate phone number format if provided
      if (profileData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(profileData.phone_number)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }



      const updated = await accountService.modifyProfile(
        account_id,
        profileData
      );
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

async getProfile(req, res) {
  try {
    const account_id = req.user.id;

    const profileData = await accountService.getProfile(account_id);

    if (!profileData) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(profileData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


}
