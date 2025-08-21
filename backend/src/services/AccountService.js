import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { ProfileRepository } from '../repositories/ProfileRepository.js';

const accountRepo = new AccountRepository();
const profileRepo = new ProfileRepository();

export class AccountService {
  async register(account) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    account.password = hashedPassword;
    const createdAccount = await accountRepo.create(account);
    await profileRepo.create({
      account_id: createdAccount.account_id,
      content: null,
    });

    return createdAccount;
  }

  async login(username, password) {
    try {
      const user = await accountRepo.findByUsername(username);
      if (!user) {
  
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
      
        throw new Error('Invalid password');
      }

     

      const token = jwt.sign(
        { id: user.account_id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { user, token };
    } catch (err) {
      console.error('⚠️ Error en login:', err.message);
      throw err;
    }
  }

  async recoverPassword(email) {
    const user = await accountRepo.findByEmail(email);
    if (!user) throw new Error('Email not found');
    
    return true;
  }

  async modifyProfile(account_id, profileData) {
    const account = await accountRepo.findById(account_id);
    if (!account) throw new Error('Account not found');

    // Conservar valores anteriores si el nuevo valor no es válidoAdd commentMore actions
    const email =
    profileData.email !== null && profileData.email !== undefined && profileData.email !== ''
      ? profileData.email
      : account.email;

     const phone_number =
    profileData.phone_number !== null && profileData.phone_number !== undefined && profileData.phone_number !== ''
      ? profileData.phone_number
      : account.phone_number;


     let password = account.password;
      if (profileData.password) {
        password = await bcrypt.hash(profileData.password, 10);
      }

    const updatedAccount = {
      ...account,
      email,
      phone_number,
      password,
      account_id
    };

    await accountRepo.update(updatedAccount);

     // Si se proporcionó "content", actualizar el perfilAdd commentMore actions
    let updatedProfile = null;
    if (profileData.content !== undefined) {
    const profile = await profileRepo.findByAccountId(account_id);
    if (profile) {
      updatedProfile = await profileRepo.update({
        profile_id: profile.profile_id,
        content: profileData.content
      });
    }
  }

     // Devuelve la cuenta y el perfil actualizado (si aplica)Add commentMore actions
  return {
    account: updatedAccount,
    ...(updatedProfile && { profile: updatedProfile })
  };
  }

  async getProfile(account_id) {
  return await accountRepo.findWithProfile(account_id);
}

}

