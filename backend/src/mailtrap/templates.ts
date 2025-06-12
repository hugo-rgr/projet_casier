export const LOCKER_RESERVATION_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Casier Réservé</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Casier Réservé</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
    <p>Bonjour {username},</p>
    <p>🎉 Votre réservation a été enregistrée avec succès !</p>
    <p>Voici les détails :</p>
    <ul>
      <li><strong>Numéro de casier :</strong> {lockerNumber}</li>
      <li><strong>Date de début :</strong> {startDate}</li>
      <li><strong>Date de fin :</strong> {endDate}</li>
    </ul>
    <p>Merci d'utiliser notre service de réservation de casier.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const LOCKER_RESERVATION_EXPIRED_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réservation Expirée</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #f44336, #e53935); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Réservation Expirée</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
    <p>Bonjour {username},</p>
    <p>⏳ Votre réservation du casier n° {lockerNumber} a expiré.</p>
    <p>Si vous avez besoin d'un casier, veuillez effectuer une nouvelle réservation via notre plateforme.</p>
    <p>Merci de votre compréhension.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérifiez votre email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Vérifiez votre email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px;">
    <p>Bonjour {username},</p>
    <p>Voici votre code de vérification :</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Ce code expirera dans 60 minutes.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue !</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #1E88E5); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Bienvenue !</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px;">
    <p>Bonjour {username},</p>
    <p>🎉 Votre email a été vérifié avec succès.</p>
    <p>Vous pouvez maintenant réserver votre casier en toute tranquillité.</p>
    <p>Merci pour votre confiance.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #FF9800, #FB8C00); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Réinitialisation de mot de passe</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px;">
    <p>Bonjour {username},</p>
    <p>Voici votre code de réinitialisation :</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF9800;">{resetToken}</span>
    </div>
    <p>Ce code expirera dans 60 minutes.</p>
    <p>Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mot de passe réinitialisé</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Mot de passe réinitialisé</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px;">
    <p>Bonjour,</p>
    <p>Votre mot de passe a bien été modifié.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Si ce n'était pas vous, contactez notre support immédiatement.</p>
    <p>Cordialement,<br>L'équipe LockerAPI</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ce message est automatique, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
`;

export const LOCKER_RESERVATION_EXPIRATION_REMINDER_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Rappel : Réservation de casier bientôt expirée</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background-color: #f39c12; padding: 20px; text-align: center; color: white;">
    <h1>Votre réservation expire bientôt</h1>
  </div>
  <div style="background-color: #fff8e1; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Bonjour {username},</p>
    <p>Nous vous rappelons que votre réservation du casier <strong>#{lockerNumber}</strong> expirera dans moins de 24 heures.</p>
    <p>Date et heure d’expiration : <strong>{expirationTime}</strong></p>
    <p>Merci de penser à retirer vos affaires ou à renouveler votre réservation si nécessaire.</p>
    <p>Bien cordialement,<br/>L'équipe de réservation des casiers</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #999;">
    <p>Ceci est un message automatique, merci de ne pas répondre.</p>
  </div>
</body>
</html>
`;

