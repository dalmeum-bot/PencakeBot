import discord

class Bot(discord.Bot):
	async def on_ready(self):
		print(f'Logged in as {self.user}')

	async def on_member_join(self, member):
		role = discord.utils.get(member.guild.roles, name=("Bot" if member.bot else "User"))
		member.add_roles(role)

class OnOffButton(discord.ui.view):
	def __init__(self):
		self.on = True

	def press(self):
		self.on = not self.on