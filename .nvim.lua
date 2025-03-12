vim.api.nvim_create_augroup("LocalIndentRules", { clear = true })

vim.api.nvim_create_autocmd("FileType", {
	group = "LocalIndentRules",
	pattern = "python,vue",
	callback = function()
		vim.bo.tabstop = 4
		vim.bo.shiftwidth = 4
		vim.bo.expandtab = true
	end,
})

vim.api.nvim_create_autocmd("FileType", {
	group = "LocalIndentRules",
	pattern = "javascript,typescript",
	callback = function()
		vim.bo.tabstop = 2
		vim.bo.shiftwidth = 2
		vim.bo.expandtab = true
	end,
})

vim.api.nvim_create_autocmd("FileType", {
	group = "LocalIndentRules",
	pattern = "make",
	callback = function()
		vim.bo.tabstop = 8
		vim.bo.shiftwidth = 8
		vim.bo.expandtab = false -- Makefiles must use tabs
	end,
})
