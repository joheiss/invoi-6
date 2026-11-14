# D02 Vertrag mit Positionen anlegen

**Epic:** D · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich einen Vertrag mit Laufzeit, Zahlungsbedingungen und Positionen anlegen, damit ich daraus Rechnungen erzeugen kann.

## Akzeptanzkriterien
1. **Gegeben** ich wähle „Vertrag anlegen", **dann** öffnet sich ein Formular (`/invoicing/contracts/new`) mit der nächsten Nummer aus dem Nummernkreis `contracts` und Standardwerten (Datum heute, Währung EUR, Fälligkeit 30 Tage, Standardlaufzeit).
2. **Gegeben** Beschreibung, Kunde (Empfängernummer), Gültig ab/bis (Beginn nicht nach Ende), Währung, Abrechnungsart, Zahlungsbedingungen, Zahlungsart und Fälligkeit sind gültig, **und** es gibt mindestens eine Position, **dann** kann ich speichern.
3. **Gegeben** ich füge eine Position hinzu, **dann** kann ich Beschreibung, Einzelpreis, Preiseinheit und „Skonto erlaubt" erfassen.
4. **Gegeben** ich speichere, **dann** ist der Vertrag mit meiner Organisation gespeichert und der Nummernkreis fortgeschrieben (siehe I01).
